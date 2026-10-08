const bookingModel = require("../models/bookings.model");
const otpModel = require("../models/otp.model");
const eventModel = require("../models/event.model");
const { sendOtpEmail, sendBookingEmail } = require("../utils/email");
const { generateOTP } = require("../utils/otp");

async function sendBookingOTP(req, res) {
  try {
    const otp = generateOTP();
    await otpModel.findOneAndDelete({
      email: req.user.email,
      action: "event-booking",
    });
    await otpModel.create({ email: req.user.email,otp, action: "event-booking" });
    await sendOtpEmail(req.user.email, otp, "event-booking");
    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
}

async function bookEvent(req, res) {
  try {
    const { eventId, otp } = req.body;

    const otpRecord = await otpModel.findOne({
      email: req.user.email,
      otp,
      action: "event-booking",
    });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP for booking" });
    }

    const event = await eventModel.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.availableSeats <= 0)
      return res.status(400).json({ message: "No seats availble" });

    const existingBooking = await bookingModel.findOne({
      userId: req.user.id,
      eventId,
      status: { $ne: "cancelled" },
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Already booked or pendig" });
    }

    const booking = await bookingModel.create({
      userId: req.user.id,
      eventId,
      status: "pending",
      paymentStatus: "not_paid",
      amount: event.ticketPrice,
    });

    await otpModel.deleteOne({ _id: otpRecord._id });
    res.status(201).json({ message: "Booking request submitted", booking });
  } catch (error) {
    console.error("bookevent errror", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function confirmBooking(req, res) {
  try {
    const paymentStatus = req.body.paymentStatus;
    if (!["paid", "non_paid"].includes(paymentStatus)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }
    const booking = await bookingModel
      .findById(req.params.id)
      .populate("eventId");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status == "confirmed") {
      return res.status(400).json({ message: "Booking is already confirmed" });
    }

    const reserved = await eventModel.findOneAndUpdate(
      { _id: booking.eventId._id, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
    );
    if (!reserved) {
      return res
        .status(400)
        .json({ message: "No seats available to confirm this booking" });
    }

    try {
      booking.status = "confirmed";
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      await booking.save();
    } catch (err) {
      // give the seat back if saving fails
      await eventModel.updateOne(
        { _id: booking.eventId._id },
        { $inc: { availableSeats: 1 } },
      );
      throw err;
    }

    try {
      await sendBookingEmail(
        booking.userId.email,
        booking.userId.name,
        booking.eventId.title,
      );
    } catch (emailError) {
      console.error("sendBookingEmail error:", emailError);
    }

    return res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("confirm booking error", error);
    return res.status(500).json({ message: "internal server erro" });
  }
}

async function getMyBookings(req, res) {
  try {
    const bookings = await bookingModel
      .find({ userId: req.user.id })
      .populate("eventId", "title date location imageUrl ticketPrice");
    return res.json(bookings);
  } catch (error) {
    console.error("getMyBookings error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await bookingModel
      .findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    const wasConfirmed = booking.status === "confirmed";

    booking.status = "cancelled";
    await booking.save();

    if (wasConfirmed) {
      await eventModel.updateOne(
        { _id: booking.eventId },
        { $inc: { availableSeats: 1 } },
      );
    }
    res.json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("cancelBooking error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = { sendBookingOTP, bookEvent, confirmBooking, getMyBookings, cancelBooking }