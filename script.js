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
  

function AcquireImage() {

    if (DWObject) {
        DWObject.SelectSourceByIndex(document.getElementById("scanner").value);
        DWObject.IfShowUI = document.getElementById("showUI").checked;
        DWObject.IfShowUI = document.getElementById("showUI").value === "true";
        DWObject.IfAutoFeed =
          document.getElementById("autofeeder").value === "true";
        DWObject.PixelType = document.querySelector(
          'input[name="PixelType"]:checked'
        ).value;
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
              console.log("Image acquired successfully. Result:", result);
              DWObject.ConvertToBW()
              DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
              DWObject.Viewer.setViewMode(2, 2);
              
              DWObject.IfShowFileDialog = true;
              DWObject.SaveAllAsPDF(
                "Sample.pdf",
                function () {
                  console.log("Successful!");
                },
                function (errCode, errString) {
                  console.log(errString);
                }
              );
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
            DWObject.ConvertToBW()
            console.log("Image acquired successfully. Result:", result);
            DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
            DWObject.Viewer.setViewMode(2, 2);
            // DWObject.ConvertToBW()
            DWObject.IfShowFileDialog = true;
            DWObject.SaveAllAsPDF(
              "Sample.pdf",
              function () {
                console.log("Successful!");
              },
              function (errCode, errString) {
                console.log(errString);
              }
            );
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


function saveIndividualPdf() {
    DWObject.IfShowFileDialog = true;
    console.log(DWObject.HowManyImagesInBuffer);
    if (DWObject.HowManyImagesInBuffer > 0) {
      for (let i = 0; i < DWObject.HowManyImagesInBuffer; i++) {
        let imageIndex = i;
  
        var pdfFilePath = `C:\\Users\\Desktop\\dynamsoft_assesment\\dynamsoft\\iteration2\\${
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
  }
  
  function removeSelectedImages() {
    if (DWObject) {
      DWObject.RemoveAllSelectedImages();
      console.log("selected images removed.");
    }
  }
  
  function removeAllImages() {
    if (DWObject) {
      DWObject.RemoveAllImages();
      console.log("All images removed.");
    }
  }
  


  