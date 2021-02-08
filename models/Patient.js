const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user: String,
  patientAddedDate: String,
  patientAge: String,
  patientDob: String,
  patientFirstName: String,
  patientFullName: String,
  patientGender: String,
  patientHouseno: String,
  patientId: String,
  patientLastName: String,
  patientMiddleName: String,
  patientMunicipality: String,
  patientPhone: String,
  patientSpouseFullName: String,
  patientVillagename: String,
  patientspousefirstname: String,
  patientspouselastname: String,
  patientwardno: String,
  image: String,
});
// patientSchema.pre("save", function (next) {
//   var self = this;
//   Patient.find({ visit_id: self.visit_id }, function (err, docs) {
//     if (!docs.length) {
//       next();
//     } else {
//       console.log("visit exists: ", self.visit_id);
//       next(new Error("User exists!"));
//     }
//   });
// });

mongoose.model("Patient", patientSchema);
