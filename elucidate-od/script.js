function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = function(e) {
      reject(e);
    };
    reader.readAsDataURL(file);
  });
}

document.getElementById('upload-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  var files = document.getElementById('file-input').files;
  var server = document.getElementById('server-select').value;

  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  formData.append('server', server);

  // Display the uploaded images immediately
  var imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = '';
  for (var i = 0; i < files.length; i++) {
    try {
      var dataURL = await readFileAsDataURL(files[i]);

      var imageWrapper = document.createElement('div');
      imageWrapper.className = 'image-wrapper col-md-6';

      var card = document.createElement('div');
      card.className = 'card';

      var imageBox = document.createElement('div');
      imageBox.className = 'image-box card-img-top';

      var originalImage = document.createElement('img');
      originalImage.src = dataURL;
      imageBox.appendChild(originalImage);

      var boundingBoxes = document.createElement('img');
      boundingBoxes.style.display = 'none';
      imageBox.appendChild(boundingBoxes);

      card.appendChild(imageBox);

      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      var toggleButton = document.createElement('button');
      toggleButton.textContent = 'Toggle Bounding Boxes';
      toggleButton.className = 'btn btn-secondary';
      toggleButton.onclick = (function(boundingBoxes) {
        return function() {
          boundingBoxes.style.display = boundingBoxes.style.display === 'none' ? '' : 'none';
        };
      })(boundingBoxes);
      cardBody.appendChild(toggleButton);

      card.appendChild(cardBody);
      imageWrapper.appendChild(card);

      imageContainer.appendChild(imageWrapper);
    } catch (e) {
      console.error(e);
    }
  }


  function displayMessage(message, timeout = 5000) {
    var messageContainer = document.getElementById('message-container');
  
    var messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = 'alert alert-info'; // Bootstrap class for styling
  
    messageContainer.appendChild(messageElement);
  
    setTimeout(function() {
      messageContainer.removeChild(messageElement);
    }, timeout);
  };

  async function fetchWithRetry(url, options, retries = 5, backoff = 180000) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      if (retries <= 0) throw new Error('Server is not responding after several retries');
      console.log(`Request failed. Retrying in ${backoff}ms...`);
      displayMessage(`Request failed. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
  }

  // Send the images to the server for inference
  console.log("Sending images to server...");

  displayMessage("Sending images to server...");

  var startTime = Date.now();
  fetchWithRetry('https://elucidate-od.gitchegumi.com/upload', {
    method: 'POST',
    body: formData
  })
  .then(data => {
    var endTime = Date.now();
    var inferenceTime = (endTime - startTime) / 1000; // time in seconds
    console.log(`Inference time: ${inferenceTime.toFixed(3)} seconds`);
    displayMessage(`Inference done after ${inferenceTime.toFixed(3)} seconds`);

    // Display the bounding boxes
    var imageWrappers = document.getElementsByClassName('image-wrapper');
    for (var i = 0; i < data.length; i++) {
      var boundingBoxes = imageWrappers[i].getElementsByTagName('img')[1];
      boundingBoxes.src = 'data:image/png;base64,' + data[i].image;
    }
  })
  .catch(error => console.error(error));
});