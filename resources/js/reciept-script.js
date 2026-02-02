async function downloadReceipt() {
  const button = event.target; // Get the button that was clicked
  const receiptElement = document.getElementById("receiptInfo");

  // Save original button content
  const originalContent = button.innerHTML;

  // Disable button and show loading state
  button.innerHTML = "⏳ Generating...";
  button.disabled = true;
  button.style.opacity = "0.6";
  button.style.cursor = "not-allowed";

  try {
    // Small delay to ensure all content is rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the receipt with high quality
    const canvas = await html2canvas(receiptElement, {
      scale: 2, // Higher quality for crisp text
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      windowWidth: receiptElement.scrollWidth,
      windowHeight: receiptElement.scrollHeight,
    });

    // Create PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit the page with margins
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10;
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png");

    // If content is taller than one page, scale it down to fit
    if (imgHeight > pageHeight - 2 * margin) {
      const scaledHeight = pageHeight - 2 * margin;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, "PNG", margin, margin, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
    }

    // Get reference number for filename
    const referenceNumber =
      document.getElementById("referenceNumber").textContent || "booking";
    const cleanReference = referenceNumber.trim().replace(/\s+/g, "-");

    // Download the PDF
    pdf.save(`receipt-${cleanReference}.pdf`);

    // Show success state
    button.innerHTML = "✅ Downloaded!";

    // Reset button after 2 seconds
    setTimeout(() => {
      button.innerHTML = originalContent;
      button.disabled = false;
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }, 2000);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate receipt. Please try again.");

    // Reset button on error
    button.innerHTML = originalContent;
    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}

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
  document.getElementById("author").textContent = data.author || "N/A";
  document.getElementById("title").textContent = data.title || "N/A";
  document.getElementById("yearPublished").textContent =
    data.year_published || "N/A";
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
