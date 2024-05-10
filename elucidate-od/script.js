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

  var formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  };

  // Display the uploaded images immediately
  var imageContainer = document.getElementById('image-container');
  imageContainer.innerHTML = '';

  generateImageGrid(files, imageContainer);


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

  async function fetchWithRetry(url, options, retries = 5, backoff = 1000) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      if (retries <= 0) throw new Error('Server is not responding after several retries');
      console.log(`Request failed. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
  }

  // Send the images to the server for inference
  console.log("Sending images to server...");

  displayMessage("Sending images to server...");

  var startTime = Date.now();

  // Show the spinner
  document.getElementById('spinner').style.display = 'block';

  fetchWithRetry('https://elucidate-od.gitchegumi.com/upload', {
    method: 'POST',
    body: 'Active Server'
  })
  .then(data => {
    // Hide the spinner
    document.getElementById('spinner').style.display = 'none';
    var endTime = Date.now();
    var inferenceTime = (endTime - startTime) / 1000; // time in seconds
    console.log(`Inference time: ${inferenceTime.toFixed(3)} seconds`);
    displayMessage(`Inference done after ${inferenceTime.toFixed(3)} seconds`);

    // Display the bounding boxes
    var imageWrappers = document.getElementsByClassName('image-wrapper');
    for (var i = 0; i < data.length; i++) {
      // Create a new 'image-wrapper' if necessary
      if (i >= imageWrappers.length) {
        var newImageWrapper = document.createElement('div');
        newImageWrapper.className = 'image-wrapper';

        // Create two new 'img' elements and add them to the 'image-wrapper'
        var originalImage = document.createElement('img');
        originalImage.src = URL.createObjectURL(files[i]); // Set the source of the original image
        originalImage.className = 'original-image';
        newImageWrapper.appendChild(originalImage);

        var boundingBoxImage = document.createElement('img');
        boundingBoxImage.className = 'bounding-box-image';
        newImageWrapper.appendChild(boundingBoxImage);

        document.body.appendChild(newImageWrapper);
      }

      var images = imageWrappers[i].getElementsByTagName('img');
      var boundingBoxes = images[1]; // The bounding box image is now the second 'img' element

      // Check if the server response has the expected properties
      if (data[i].image) {
        boundingBoxes.src = 'data:image/png;base64,' + data[i].image;
      } else {
        console.error('Server response does not have the expected properties');
      }
    }
});

    function generateImageGrid(files, container) {
      container.innerHTML = '';

      for (let i = 0; i < files.length; i += 2) {
        const row = document.createElement('div');
        row.className = 'row';
        container.appendChild(row);

        for (let j = 0; j < 2 && i + j < files.length; j++) {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          row.appendChild(col);

          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'image-wrapper';
          col.appendChild(imgWrapper);

          const img = document.createElement('img');
          img.src = URL.createObjectURL(files[i + j]);
          img.className = 'base-image';
          img.onload = function() {
            URL.revokeObjectURL(this.src);
          };
          imgWrapper.appendChild(img);

          const boundingBoxes = document.createElement('img');
          boundingBoxes.className = 'bounding-box';
          boundingBoxes.style.display = 'none';
          imgWrapper.appendChild(boundingBoxes);

          const btn = document.createElement('button');
          btn.textContent = 'Toggle Bounding Box';
          btn.className = 'btn btn-secondary';

          const toggleBoundingBox = () => {
            if (boundingBoxes.style.display === 'none') {
              boundingBoxes.style.display = 'block';
            } else {
              boundingBoxes.style.display = 'none';
            }
          };

          btn.addEventListener('click', toggleBoundingBox);
          imgWrapper.appendChild(btn);
        }
      }
    }
});
