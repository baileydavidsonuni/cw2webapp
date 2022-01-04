//The URIs of the REST endpoint
IUPS = "https://prod-12.eastus.logic.azure.com:443/workflows/2eddfb3d3f1940ce9bd0971b04645be0/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mEv03kQxmJ_UyG31hwSL1-4TAwm9g9QsWae3LgFbkjA";
RAP = "https://prod-27.eastus.logic.azure.com:443/workflows/06ac3d75465a424eba3ac7e1192c45bf/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZjNfU_x4tb_6VsNNe7Vf3tzOqkvzXN_H9zKBC1JvvcY";

BLOB_ACCOUNT = "https://cw2blob.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(async function() {

  async function getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    console.log(payload);
    const { clientPrincipal } = payload;
    return clientPrincipal.userDetails;
  }
  
try {

  var user = await getUserInfo();
  $('#user').text(user);
  $('#login').hide();
  } catch (err) {
  console.log(err);
  }
  

  $("#retImages").click(function(){

      //Run the get asset list function
      getImages();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset(){
  //Create a form data object
   submitData = new FormData();
   //Get form variables and append them to the form data object
   submitData.append('FileName', $('#FileName').val());
   submitData.append('userID', $('#userID').val());
   submitData.append('userName', $('#userName').val());
  var files = $("#UpFile").prop('files');
  submitData.append('File', files[0]);
  
   //Post the form data to the endpoint, note the need to set the content type header
   $.ajax({
   url: IUPS,
   data: submitData,
   cache: false,
   enctype: 'multipart/form-data',
   contentType: false,
   processData: false,
   type: 'POST',
   success: function(data){
  
   }
   });
  }
  

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages(){
  //Replace the current HTML in that div with a loading message
   $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
   $.getJSON(RAP, function( data ) {
  console.log(data)
   //Create an array to hold all the retrieved assets
   var items = [];
  
   //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
   $.each( data, function( key, val ) {
   items.push( "<hr />");
   items.push("<img src='"+BLOB_ACCOUNT + val["filePath"] +"' width='400'/> <br />")
   items.push( "File : " + val["fileName"] + "<br />");
   items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />");
   items.push( "<hr />");
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
  

