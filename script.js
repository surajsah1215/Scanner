var DWObject;

Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", Dynamsoft_OnReady);


function Dynamsoft_OnReady() {
    DWObject = Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer");
    
    availableSources();
}

function availableSources() {
    let sourceDropdown = document.getElementById("scanner");
    sourceDropdown.innerHTML = "";
  
    DWObject.IfShowUI = false; 
    DWObject.OpenSourceManager();
    let sourceCount = DWObject.SourceCount;
    for (let i = 0; i < sourceCount; i++) {
      let sourceName = DWObject.GetSourceNameItems(i);
      let option = document.createElement("option");
      option.value = i;
      option.text = sourceName;
      sourceDropdown.add(option);
    }
    DWObject.CloseSourceManager();
  }

  function toggleCheckboxValue(id) {
    let checkbox = document.getElementById(id);
    checkbox.checked == "true" ? "false" : "true";
  }
  
  function toggleShowUI() {
    if (DWObject) {
      DWObject.IfShowUI = document.getElementById("showUI").checked;
    }
  }

  function resolutionChanger(index){
    var resolutionSelect = document.getElementById('resolution');
    var selectedResolution = parseInt(resolutionSelect.value); 
    index = parseInt(index)
    DWObject.SetDPI(index-1,selectedResolution,selectedResolution)

    var errorCode = DWObject.ErrorCode;
    if (errorCode !== 0) {
      console.error('Error setting DPI:', DWObject.ErrorString);
    }

  }
  
function scanImage(fun){
  if (DWObject) {
    DWObject.SelectSourceByIndex(document.getElementById("scanner").value);
    DWObject.IfShowUI = document.getElementById("showUI").checked;
    DWObject.IfShowUI = document.getElementById("showUI").value === "true";
    DWObject.IfAutoFeed =
      document.getElementById("autofeeder").value === "true";
    var pixelType = document.querySelector(
      'input[name="PixelType"]:checked'
    ).value;
    DWObject.pixelType = pixelType
    DWObject.Resolution = parseInt(document.getElementById("resolution").value);
  }

  if (document.getElementById("showUI").checked) {
    if (DWObject) {
      DWObject.SelectSourceAsync()
        .then(function () {
          toggleShowUI();  
          return DWObject.AcquireImageAsync({
            IfCloseSourceAfterAcquire: true,
          });
        })
        .then(function (result) {
          console.log("Image acquired for inbuild scanner successfully. Result:", result);
          
          DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
          DWObject.Viewer.setViewMode(2, 2);
          fun();
    
        })
        .catch(function (e) {
          console.error("Error acquiring image: " + e.message);
        })
        .finally(function () {
          DWObject.CloseSourceAsync().catch(function (e) {
            console.error(e);
          });
        });
    }
  } else {
    return DWObject.AcquireImageAsync({
      IfCloseSourceAfterAcquire: true,
    })
      .then(function (result) {
        var index = DWObject.HowManyImagesInBuffer
        console.log("Image acquired successfully. Result:", result);
        if (pixelType == "blackAndWhite") {
          DWObject.ConvertToBW(index-1);
        } else if(pixelType == "gray") {
          DWObject.ConvertToGrayScale(index-1);
        }
        resolutionChanger(index); //to change the resolution
        DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
        DWObject.Viewer.setViewMode(2, 2);
        fun()
      })
      .catch(function (e) {
        console.error("Error acquiring image: " + e.message);
      })
      .finally(function () {
        DWObject.CloseSourceAsync().catch(function (e) {
          console.error(e);
        });
      });
  }
}

function AcquireImage() {
    scanImage(()=>{
      DWObject.IfShowFileDialog = true;
      DWObject.SaveAllAsPDF(
        "result.pdf",
        function () {
          console.log("Successful!");
        },
        function (errCode, errString) {
          console.log(errString);
        }
      );
    })
    
}


function saveIndividualPdf() {
    scanImage(()=>{
      DWObject.IfShowFileDialog = true;
      console.log(DWObject.HowManyImagesInBuffer);
      if (DWObject.HowManyImagesInBuffer >= 0) {
        for (let i = 0; i <=DWObject.HowManyImagesInBuffer; i++) {
          let imageIndex = i;
    
          var pdfFilePath = `C:\\Users\\Desktop\\dynamsoft_assesment\\image_${
            i + 1
          }.pdf`;
    
          console.log(
            DWObject.SaveAsPDF(
              pdfFilePath,
              imageIndex,
              function () {
                console.log("success:", pdfFilePath);
              },
              function (code, string) {
                console.log(code, string);
              }
            )
          );
        }
        console.log("Done");
      } else {
        console.log("No Scanned Images");
      }

    })
    
  }
  
  function removeBlankImages() {
     if (DWObject) {
        var arr = []
          for (let i = 0; i <DWObject.HowManyImagesInBuffer; i++) {
            if(DWObject.IsBlankImage(i)){
                arr.push(i)
            }
          }
      
        DWObject.SelectImages(arr);
        DWObject.RemoveAllSelectedImages();  
    
    }
  }
  
  function removeAllImages() {
    if (DWObject) {
      DWObject.RemoveAllImages();
      console.log("All images removed.");
    }
  }
  


  