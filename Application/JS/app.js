//The URIs of the REST endpoint
IUPS = "https://prod-34.eastus.logic.azure.com:443/workflows/c97c7bcd031a4bb99828680c41dd94d9/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iz6znBc6jB13LImm53smhXSw11WXYc1UhvUemkc-fiI";
RAI = "https://prod-66.eastus.logic.azure.com:443/workflows/720b9e08f08f45d2abbe0e64d1024e1b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Wr_JPdz9QI1THijxmeSZSc-CFaFMoJ-plnW9POOxtC4";
DIA1 = "https://prod-88.eastus.logic.azure.com/workflows/4cb9e48c6cdc425581c28d5b293722da/triggers/manual/paths/invoke/";
DIA2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=73zOxQWVLKUNAJiGFWsFRjsGs-HGSimswJR5FEuloA4";
UIA1 = "https://prod-86.eastus.logic.azure.com/workflows/8651dd42030b42499494f31bce9ea202/triggers/manual/paths/invoke/";
UIA2 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=o9DiVRkjuud9pKxHnFak_BKw1ekG6CcqIldY_KD9QTI";
LOGIN = "https://prod-12.eastus.logic.azure.com:443/workflows/02aeda35541146b5b2f0b9e8b406fa8a/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YyNosnJOrdbsaSruGm_CwNHW96Z8DcVksUHybfyvlus";
REGISTER = "https://prod-77.eastus.logic.azure.com:443/workflows/fc78633c445843e2957f386665ce6261/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=afDIiJFlJlb9wl3jIjoKlvtHBU1vGoxRENeM4tF7JB0";

BLOB_ACCOUNT = "https://blobstoragecom682lm.blob.core.windows.net";
USERID = 0;
USERNAME = "";

//Handlers for button clicks
$(document).ready(function() {

  getImages();

  $("#deleteMedia").click(function(){

    //Run the get asset list function
    deleteMedia();

}); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 

  $("#login").click(function(){
    login();
  });

  $("#logout").click(function () {
    logout();
  });

  $("#register").click(function(){
    register();
  });



function logout() {
  USERID = 0;
  USERNAME = "";
  $("#Login").toggle();
  $("#newAssetForm").toggle();
  $("#logout").toggle();
}
});

function login() {
$.getJSON(LOGIN, function (user) {
  alert("clicked");
  loggedIn=false;
  //Create an array to hold all the retrieved assets
  $.each(user, function (key, val) {
    username = $("#UserName").val();
    password = $("#UserPassword").val();
    if (val["UserName"] == username && val["UserPassword"] == password) {

      loggedIn = true;
      USERID = val["UserID"];
      USERNAME = val["UserName"];
      $("#Login").toggle()
      $("#newAssetForm").toggle()
      $("#logout").toggle()


    }
  });

  if(loggedIn != true){
    alert("Incorrect Username or Password")
  }
});
}


//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  
 //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('FileName', $('#FileName').val());
 submitData.append('userID', USERID);
 submitData.append('userName', USERNAME);
 submitData.append('File', $("#UpFile")[0].files[0]);
 submitData.append('type', $("#UpFile")[0].files.item(0).type);


 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: IUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){}
 });
 getImages();
}

function register(){
  
  //Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append('UserName', $('#UserName').val());
  submitData.append('UserPassword', $('#UserPassword').val());
 
 
  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
  url: REGISTER,
  data: submitData,
  cache: false,
  enctype: 'multipart/form-data',
  contentType: false,
  processData: false,
  type: 'POST',
  success: function(data){}
  });
 }

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){

  //Replace the current HTML in that div with a loading message
 $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
 $.getJSON(RAI, function(data ) {
 //Create an array to hold all the retrieved assets
 var items = [];

 //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
 $.each( data, function( key, val ) {
    items.push( "<hr />");
    items.push("<h1>" +val["type"] + "</h1>");
    if (val["type"] == 'video/mp4')
    {
    items.push("<video controls width='400' height='320'><source src='"+BLOB_ACCOUNT + val["filePath"] +"'/></video><br />");
    }
    else if (val["type"] == 'audio/mpeg')
    {
    items.push("<audio controls> <source src='"+BLOB_ACCOUNT + val["filePath"] +"' type='audio/mpeg'> </audio>")
    }
    else {
    items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />");
    }
    items.push( "File : " + val["fileName"] + "<br />");
    items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />");
    items.push( "<hr />");
    items.push('<button onclick="deleteMedia(\''+val["id"]+'\')" type="button" class="btn btn-danger"> Delete Media </button><br/>');
    items.push('<button onclick="updateMedia(\''+val["id"]+'\')" type="button" class="btn btn-primary">Update</button><br />');
  });
    //Clear the assetlist div
    $('#ImageList').empty();
    //Append the contents of the items array to the ImageList Div
    $( "<ul/>", {
    "class": "my-new-list",
    html: items.join( "" )
    }).appendTo( "#ImageList" );
    
  });


 
}

function deleteMedia(id){
  $.ajax({
    type:"DELETE",
    url: DIA1 + id + DIA2
  }).done(function(msg){
    getImages();
  })
  alert("Media deleted")
}

function updateMedia(id){
  submitEditData = new FormData();
  //Get form variables and append them to the form data object
  submitEditData.append('FileName', $('#FileName').val());
  submitEditData.append('userID', USERID);
  submitEditData.append('userName', USERNAME);
  submitEditData.append('File', $("#UpFile")[0].files[0]);
  submitEditData.append('type', $("#UpFile")[0].files.item(0).type);


  $.ajax({
    url: UIA1 + id + UIA2,
    data: submitEditData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'PUT',
    success: function(data){
   
    }
    });
    getImages();
    setTimeout(refresh, 2000)
    function refresh() {
      location.reload(true);
    }

     
  
  }