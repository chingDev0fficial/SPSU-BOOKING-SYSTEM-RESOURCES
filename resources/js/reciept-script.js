window.addEventListener("DOMContentLoaded", () => {
  const receiptData = sessionStorage.getItem("bookingResourcesData");

  if (!receiptData) {
    alert("No receipt data found. Redirecting to booking page...");
    window.location.href = "index.html";
    return;
  }

  const data = JSON.parse(receiptData)[0];

  console.log(data);

  // Capitalize first letter of booker type
  const bookerTypeFormatted = data.bookers_type
    ? data.bookers_type.charAt(0).toUpperCase() + data.bookers_type.slice(1)
    : "N/A";

  // Populate receipt
  document.getElementById("referenceNumber").textContent =
    data.reference_number;
  document.getElementById("bookingName").textContent = data.bookers_name;
  document.getElementById("bookerType").textContent = bookerTypeFormatted;
  document.getElementById("email").textContent = data.email || "N/A";
  document.getElementById("utilization").textContent =
    data.utilization_of_materials;
  document.getElementById("materialsType").textContent = data.type_of_materials;
  document.getElementById("resource").textContent = data.booked_resources_id;
  document.getElementById("date").textContent = new Date(
    data.date
  ).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  document.getElementById("timestamp").textContent = new Date(
    data.timestamp
  ).toLocaleString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
});

function goBackToBooking() {
  // Clear receipt data
  sessionStorage.removeItem("bookingReceipt");
  // Redirect to booking page
  window.location.href = "index.html";
}
