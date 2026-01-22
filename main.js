var qrcode = new QRCode(document.getElementById("qrcode"), {
  text: "https://example.com",
  width: 1000,
  height: 1000,
  correctLevel: QRCode.CorrectLevel.L,
});

var urlInput = document.getElementById("urlInput");

var ssidInput = document.getElementById("ssidInput");
var pwdInput = document.getElementById("pwdInput");
var encryptionInput = document.getElementById("encryptionInput");

var whatsappInput = document.getElementById("whatsappInput");

var firstNameInput = document.getElementById("firstNameInput");
var lastNameInput = document.getElementById("lastNameInput");
var organizationInput = document.getElementById("organizationInput");
var isCompanyInput = document.getElementById("isCompanyInput");
var emailInput = document.getElementById("emailInput");
var phoneInput = document.getElementById("phoneInput");
var streetInput = document.getElementById("streetInput");
var cityInput = document.getElementById("cityInput");
var stateInput = document.getElementById("stateInput");
var zipInput = document.getElementById("zipInput");
var countryInput = document.getElementById("countryInput");
var contactUrlInput = document.getElementById("contactUrlInput");
var birthdayInput = document.getElementById("birthdayInput");

var buttonDownload = document.getElementById("download-button");
var buttonCopy = document.getElementById("copy-button");

const inputElements = [
  urlInput,
  ssidInput,
  pwdInput,
  encryptionInput,
  whatsappInput,
  firstNameInput,
  lastNameInput,
  organizationInput,
  isCompanyInput,
  emailInput,
  phoneInput,
  streetInput,
  cityInput,
  stateInput,
  zipInput,
  countryInput,
  contactUrlInput,
  birthdayInput,
];

inputElements.forEach((input) => {
  if (input) input.addEventListener("input", updateCode);
});

buttonDownload.addEventListener("click", downloadCode);
buttonCopy.addEventListener("click", copyCodeToClipboard);

function updateCode() {
  if (urlInput) {
    updateTextCode();
  } else if (ssidInput) {
    updateWifiCode();
  } else if (whatsappInput) {
    updateWhatsappCode();
  } else if (firstNameInput) {
    updateContactCode();
  }
}

function updateTextCode() {
  var newUrl = urlInput.value;
  qrcode.clear();
  qrcode.makeCode(newUrl);
}

function updateWhatsappCode() {
  // only numbers, spaces allowed, possibility of a leading +
  var phoneRegex = /^\+?[0-9 ]+$/;
  var isValid = phoneRegex.test(whatsappInput.value);
  if (!isValid && whatsappInput.value !== "") {
    whatsappInput.setCustomValidity("Please enter a valid phone number.");
    whatsappInput.reportValidity();
    return;
  } else {
    whatsappInput.setCustomValidity("");
  }
  var whatsappInputCleaned = whatsappInput.value
    .replace(/ /g, "")
    .replace(/^\+/, "");
  console.log(whatsappInputCleaned);
  var whatsappString = `https://wa.me/${whatsappInputCleaned}`;

  qrcode.clear();
  qrcode.makeCode(whatsappString);
}

function updateWifiCode() {
  var wifiString =
    encryptionInput.value !== "nopass"
      ? `WIFI:T:${encryptionInput.value};S:${ssidInput.value};P:${pwdInput.value};;`
      : `WIFI:T:nopass;S:${ssidInput.value};;`;
  if (encryptionInput.value === "nopass") {
    pwdInput.disabled = true;
  } else {
    pwdInput.disabled = false;
  }
  qrcode.clear();
  qrcode.makeCode(wifiString);
}

function updateContactCode() {
  const data = {
    firstName: firstNameInput.value || undefined,
    lastName: lastNameInput.value || undefined,
    organization: organizationInput.value || undefined,
    isCompany: isCompanyInput.checked,
    email: emailInput.value || undefined,
    phone: phoneInput.value || undefined,
    address: `${streetInput.value};${cityInput.value};${stateInput.value};${zipInput.value};${countryInput.value}`,
    url: contactUrlInput.value || undefined,
    birthday: birthdayInput.value
      ? new Date(birthdayInput.value).toISOString().split("T")[0]
      : undefined,
  };
  const lines = {
    beggining: "BEGIN:VCARD",
    version: "VERSION:3.0",
    ...((data.firstName || data.lastName) && {
      name: `N:${data.lastName || ""};${data.firstName || ""};;;`,
    }),
    ...((data.firstName || data.lastName) && {
      formattedName: `FN:${data.firstName || ""} ${data.lastName || ""}`,
    }),
    ...(data.organization && { organization: `ORG:${data.organization}` }),
    ...(data.isCompany && { showAs: "X-ABShowAs:COMPANY" }),
    ...(data.email && { email: `EMAIL;INTERNET:${data.email}` }),
    ...(data.phone && { telephone: `TEL:${data.phone}` }),
    ...(data.address &&
      data.address !== ";;;" && { address: `ADR:;;${data.address}` }),
    ...(data.url && { url: `URL:${data.url}` }),
    ...(data.birthday && { birthday: `BDAY:${data.birthday}` }),
    end: "END:VCARD",
  };
  if (!data.isCompany) {
    delete lines.showAs;
  }
  const vcardString = Object.values(lines).join("\n");
  qrcode.clear();
  qrcode.makeCode(vcardString);
}

function downloadCode() {
  var canvas = document.querySelector("#qrcode canvas");
  var dataUrl = canvas.toDataURL("image/png");
  var a = document.createElement("a");
  a.href = dataUrl;
  a.download = "qrcode.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function copyCodeToClipboard() {
  var canvas = document.querySelector("#qrcode canvas");
  canvas.toBlob(function (blob) {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
  });
}

// Initial code
updateCode();
