// const RESOURCES_API =
//   "https://script.google.com/macros/s/AKfycbyAIdMqG4Bfd-SUdtZhQfKAeyHXmheKTDp8QLFIkzAJDp1nXRcnY8hIO73WvKDmjjbH/exec";
const INSERT_BOOKING_RESOURCE_API =
  "https://script.google.com/macros/s/AKfycbzfPZFXO7MXNCdS80CSwyiT4JwTyd2ShW1iWtLvhnhmvlsJHICMCCemXqa81CisvCtV/exec";
const BOOKED_RESOURCES_API =
  "https://script.google.com/macros/s/AKfycbzBn1LabXAKnX8NjPUn1OrH5RSPyoHeGPIIW3WgPJ_-6rHW30XIeAWxKdTtxwJjLupp/exec";

const utilizationSelect = document.getElementById("utilization");
const materialsType = document.getElementById("materials_type");
const bookingForm = document.getElementById("booking-form");
// const custom_select_options = document.getElementById("options");
// const seach = document.getElementById("search");
const author = document.getElementById("author");
const title = document.getElementById("title");
const yearPublished = document.getElementById("yearPublished");
const errorMsg = document.getElementById("errorMsg");
const submitBtn = document.getElementById("submit-btn");

function hanldeUtilizationChange(e) {
  function defaultProcess() {
    materialsType.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Select material type";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    materialsType.appendChild(defaultOption);
  }

  function generateInsideOptions() {
    options = {
      books: "Books",
      fiction: "Fiction",
      thesis: "Thesis",
      periodicals: "Periodicals",
    };

    defaultProcess();

    Object.entries(options).forEach(([key, text]) => {
      const option = document.createElement("option");

      option.value = key;
      option.text = text;
      materialsType.appendChild(option);
    });
  }
  function generateHomeOptions() {
    options = {
      books: "Books",
      fiction: "Fiction",
    };

    defaultProcess();

    Object.entries(options).forEach(([key, text]) => {
      const option = document.createElement("option");

      option.value = key;
      option.text = text;
      materialsType.appendChild(option);
    });
  }

  const optionsMapping = {
    inside: generateInsideOptions,
    home: generateHomeOptions,
  };

  let selectedValue = e.target.value;

  optionsMapping[selectedValue]();
}

// async function handleMaterialsChange(e) {
//   const targetValue = e.target.value;

//   const handleFetchResources = async (materialType) => {
//     try {
//       const response = await fetch(
//         `${RESOURCES_API}?material_type=${materialType}`
//       );

//       if (!response.ok) {
//         throw new Error("Error fetching resources");
//       }

//       const result = await response.json();
//       return result;
//     } catch (e) {
//       console.error(`An error occurs ${e}`);
//       return [];
//     }
//   };

//   custom_select_options.innerHTML = "";

//   const div = document.createElement("div");
//   div.className = "loader";
//   custom_select_options.appendChild(div);

//   const resources = await handleFetchResources(targetValue);

//   resources.forEach((resource) => {
//     const li = document.createElement("li");
//     li.setAttribute("value", resource.id);
//     li.setAttribute("text-value", resource.title);
//     li.innerHTML = `${resource.title} <span style="display: none">${resource.author} ${resource.year_published}</span>`;
//     div.style.display = "none";
//     custom_select_options.appendChild(li);
//   });

//   seach.style.display = "block";
// }

function submitForm(e) {
  e.preventDefault();

  const noBookedResource =
    !author.value && !title.value && !yearPublished.value;

  if (noBookedResource) {
    console.log("Value:", author.value);
    errorMsg.textContent =
      "No resources being booked. Please book a resources by filling up Author/Title/Year Published.";
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.textContent = "";
  errorMsg.style.display = "none";

  submitBtn.textContent = "Submitting...";

  const formData = new FormData(bookingForm);
  const timestamp = new Date();
  const bookedRef = "BK" + timestamp.getTime();

  formData.append("booked_ref", bookedRef);
  formData.append("timestamp", timestamp);

  const handleInsertResourceBooking = async () => {
    try {
      const params = new URLSearchParams(formData).toString();

      await fetch(INSERT_BOOKING_RESOURCE_API, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the booking.");
    }
  };

  const handleFetchResourcesBooking = async (bookedRef) => {
    try {
      const response = await fetch(
        `${BOOKED_RESOURCES_API}?booked_ref=${bookedRef}`
      );

      if (!response.ok) throw new Error("Error fetching booked resources");

      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  handleInsertResourceBooking().then(() => {
    setTimeout(() => {
      handleFetchResourcesBooking(bookedRef).then((bookingResourcesData) => {
        sessionStorage.setItem(
          "bookingResourcesData",
          JSON.stringify(bookingResourcesData)
        );
        window.location.href = "reciept.html";
        // console.log(bookingResourcesData);
      });
    }, 500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (utilizationSelect) {
    utilizationSelect.addEventListener("change", hanldeUtilizationChange);
  }

  // if (materialsType) {
  //   materialsType.addEventListener("change", handleMaterialsChange);
  // }

  if (bookingForm) {
    bookingForm.addEventListener("submit", submitForm);
  }
});
