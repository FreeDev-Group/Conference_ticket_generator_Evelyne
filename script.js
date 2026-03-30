const form = document.querySelector('form');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');
const ticketPreview = document.querySelector('.ticket-preview');
const previewAvatar = document.querySelector('.ticket-preview .avatar img');
const ticketName = document.querySelector('.ticket-preview .attendee-name p');
const ticketGithub = document.querySelector('.ticket-preview .attendee-name span');
const ticketId = document.querySelector('.ticket-id');
const titleHeading = document.querySelector('.title-container h1');
const titleMessage = document.querySelector('.title-container p');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const gitHubInput = document.getElementById('gitHubUserName');

const avatarMessage = document.getElementById('avatar-message');
const fullNameMessage = document.getElementById('fullName-message');
const emailMessage = document.getElementById('email-message');
const gitHubMessage = document.getElementById('gitHubUserName-message');
const uploadPreviewImage = document.querySelector('.upload-preview-image');
const uploadActions = document.querySelector('.upload-actions');
const removeImageButton = document.getElementById('remove-image');
const changeImageButton = document.getElementById('change-image');

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const maxFileSize = 500 * 1024;
let selectedFile = null;
let currentAvatarURL = null;

function setError(messageSpan, message, inputField = null) {
  messageSpan.textContent = message;
  messageSpan.classList.add('error-message', 'has-text');

  if (inputField) {
    inputField.classList.add('error');
  }

  if (messageSpan === avatarMessage) {
    dropZone.classList.add('error');
  }
}

function clearError(messageSpan, inputField = null) {
  if (messageSpan === avatarMessage) {
    messageSpan.textContent = 'Upload your photo (JPG or PNG, max size: 500KB)';
    messageSpan.classList.add('has-text');
  } else {
    messageSpan.textContent = '';
    messageSpan.classList.remove('has-text');
  }
  messageSpan.classList.remove('error-message');

  if (inputField) {
    inputField.classList.remove('error');
  }

  if (messageSpan === avatarMessage) {
    dropZone.classList.remove('error');
  }
}

function clearAllErrors() {
  clearError(avatarMessage);
  clearError(fullNameMessage, fullNameInput);
  clearError(emailMessage, emailInput);
  clearError(gitHubMessage, gitHubInput);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateTicketId() {
  return `#${String(Math.floor(10000 + Math.random() * 90000))}`;
}

function resetDropZonePreview() {
  dropZone.classList.remove('has-image');
  if (uploadPreviewImage) {
    uploadPreviewImage.src = '';
  }
  if (uploadActions) {
    uploadActions.hidden = true;
  }
}

function updateAvatarPreview(file) {
  if (!file) {
    resetDropZonePreview();
    return;
  }

  if (currentAvatarURL) {
    URL.revokeObjectURL(currentAvatarURL);
  }

  currentAvatarURL = URL.createObjectURL(file);
  previewAvatar.src = currentAvatarURL;

  if (uploadPreviewImage) {
    uploadPreviewImage.src = currentAvatarURL;
    dropZone.classList.add('has-image');
  }
  if (uploadActions) {
    uploadActions.hidden = false;
  }
}

function validateFile(file) {
  if (!file) {
    setError(avatarMessage, 'Upload an avatar image.', null);
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    setError(avatarMessage, 'Only JPG or PNG formats are allowed.', null);
    return false;
  }

  if (file.size > maxFileSize) {
    setError(avatarMessage, 'File too large. Please upload a photo under 500KB.', null);
    return false;
  }

  return true;
}

function handleFileSelection(file) {
  clearError(avatarMessage);

  if (!file) {
    selectedFile = null;
    resetDropZonePreview();
    return;
  }

  if (!validateFile(file)) {
    selectedFile = null;
    resetDropZonePreview();
    return;
  }

  selectedFile = file;
  updateAvatarPreview(file);
}

function validateForm() {
  clearAllErrors();

  let isValid = true;

  if (!selectedFile) {
    setError(avatarMessage, 'Upload an avatar image.', null);
    isValid = false;
  }

  if (!fullNameInput.value.trim()) {
    setError(fullNameMessage, 'Full name is required.', fullNameInput);
    isValid = false;
  }

  const emailValue = emailInput.value.trim();
  if (!emailValue) {
    setError(emailMessage, 'Email address is required.', emailInput);
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(emailMessage, 'Please enter a valid email address.', emailInput);
    isValid = false;
  }

  if (!gitHubInput.value.trim()) {
    setError(gitHubMessage, 'GitHub username is required.', gitHubInput);
    isValid = false;
  }

  return isValid;
}

function updateTicketPreview() {
  ticketName.textContent = fullNameInput.value.trim();
  const rawGithub = gitHubInput.value.trim();
  const githubHandle = rawGithub.startsWith('@') ? rawGithub : `@${rawGithub}`;
  ticketGithub.innerHTML = `<img src="assets/images/icon-github.svg" alt="GitHub icon"> ${githubHandle}`;
  ticketId.textContent = generateTicketId();

  titleHeading.innerHTML = `Congrats, <span class="name-highlight">${fullNameInput.value.trim()}</span>! Your ticket is ready.`;
  titleMessage.innerHTML = `We've emailed your ticket to <span class="highlight-email">${emailInput.value.trim()}</span> and will send updates in the run up to the event.`;

  document.querySelector('.ticket-form').style.display = 'none';
  ticketPreview.style.display = 'block';
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleFileSelection(file);
});

[fullNameInput, emailInput, gitHubInput].forEach((input) => {
  const hintElement = document.getElementById(`${input.id}-message`);
  input.addEventListener('input', () => {
    if (!hintElement) return;
    if (input.id === 'email') {
      clearError(hintElement, emailInput);
    } else if (input.id === 'fullName') {
      clearError(hintElement, fullNameInput);
    } else if (input.id === 'gitHubUserName') {
      clearError(hintElement, gitHubInput);
    }
  });
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add('drag-over');
  });
});

dropZone.addEventListener('dragleave', (event) => {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();
  dropZone.classList.remove('drag-over');

  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileSelection(file);
  }
});

dropZone.addEventListener('click', () => {
  fileInput.click();
});

if (removeImageButton) {
  removeImageButton.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    resetDropZonePreview();
    clearError(avatarMessage);
  });
}

if (changeImageButton) {
  changeImageButton.addEventListener('click', () => {
    fileInput.click();
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  updateTicketPreview();
});
