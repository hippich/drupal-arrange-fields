// $Id$ 
  
var arrangeFieldsStartupHeight;
var arrangeFieldsGreatestHeight;
var arrangeFieldsDragging;
  
Drupal.behaviors.arrangeFieldsStartup = function() {
 
  // This section of code makes the "handle" appear for draggable items, which users
  // may use to drag the item, or for important links to appear there.
  $(".arrange-fields-container .draggable-form-item").bind("mouseenter", function(event) {
    var hand = $(this).find(".arrange-fields-control-handle");
    if (arrangeFieldsDragging != true) {
      $(hand).show();
    }
  });

  $(".arrange-fields-container .draggable-form-item").bind("mouseleave", function(event) {
    var hand = $(this).find(".arrange-fields-control-handle");
    if (arrangeFieldsDragging != true) {
      $(hand).hide();
    }
  });

  

  // Let's make the text areas and input fields resizable.  
  $(".arrange-fields-container .draggable-form-item:not(.draggable-form-item-fieldset) textarea").resizable();
  $(".arrange-fields-container .draggable-form-item:not(.draggable-form-item-fieldset) .form-text").resizable({
        handles: 'e'
  });

  // This actually makes the draggable items draggable.
  $(".arrange-fields-container .draggable-form-item").draggable({
    stop: function(event, ui) { arrangeFieldsRepositionToGrid(false); },
    containment: ".arrange-fields-container", 
    scroll: true,
    grid : [10,10],
    start: function(event, ui) {arrangeFieldsDragging = true;},
    stop:  function(event, ui) {arrangeFieldsDragging = false;}
  });

  arrangeFieldsStartupHeight = 0;
  arrangeFieldsGreatestHeight = 0;
  
  // We do the "true" if this is a totally fresh new form, with no
  // position data already saved.  
  var startup = true;
  
  try {
    if (Drupal.settings.arrangeFieldsNotNewForm == true) {
      startup = false;
    }
  }
  catch (exception) {}
  
  // Make sure everything starts off on a grid line.
  arrangeFieldsRepositionToGrid(startup); 
}


/**
  * Repositions all the draggable elements to the grid lines.
  */
function arrangeFieldsRepositionToGrid(startup) {


  var gridWidth = 10;
  $(".arrange-fields-container .draggable-form-item").each(function (index, element) {
    var postop = $(element).css("top");
    var posleft = $(element).css("left");

    postop = $(element).css("top").replace("px", "");
    posleft = $(element).css("left").replace("px", "");
    
    if (postop == "auto") postop = 0; 
    if (posleft == "auto") posleft = 0;
    
    if (startup == true && postop == 0) {
      // Since this is a new form, with values not set yet,
      // let's assign the postop based on the running startupHeight
      // value.
      postop = arrangeFieldsStartupHeight;
      arrangeFieldsStartupHeight += $(element).height() + 20; 
    }
      
    if (parseInt(postop) > parseInt(arrangeFieldsGreatestHeight)) {
      arrangeFieldsGreatestHeight = parseInt(postop);
    }
    
    // We want to round the top and left positions to the nearest X (gridWidth)
    var newTop = Math.round(postop/gridWidth) * gridWidth;
    var newLeft = Math.round(posleft/gridWidth) * gridWidth;
    
    var diffLeft = "-" + (posleft - newLeft);
    var diffTop = "-" + (postop - newTop);
    
    if (posleft < newLeft) { diffLeft = newLeft - posleft; }
    if (postop < newTop) { diffTop = newTop - postop; }

    if (newTop < 0) newTop = 0;
    if (newLeft < 0) newLeft = 0;
    
   $(element).css("top", newTop + "px");
   $(element).css("left", newLeft + "px");

   // We want to resize the container as we go to make sure we don't run out of
   // room, and to make sure the user can always drag things below the rest of
   // the items on the form.
   $(".arrange-fields-container").css("height", (parseInt(arrangeFieldsGreatestHeight) + 500) + "px");
 
  });
  
}

/**
  * This method will save the position, width, and height of the draggable items
  * on the page.
  */
function arrangeFieldsSavePositions() {
  
  var dataString = "";
  var maxBottom = 0;
  
  $(".arrange-fields-container .draggable-form-item").each(function (index, element) {
   var id = $(element)[0].id;
   var top = $(element).css("top");
   var left = $(element).css("left");
   var element_type = "";
   // Now, we want to find the element inside...
   
   //var width = $(element).width();
   //var height = $(element).height();
   var width = 0;
   var height = 0;
   
   // Attempt to find either a text area or a textfield...
   var test = $(element).find("textarea");
   width = $(test).width();
   height = $(test).height();
   if (width != null) element_type = "textarea";
   
   if (width == null) {
     test = $(element).find("input:text");
     width = $(test).width();
     height = $(test).height();
     if (width != null) element_type = "input";
   }

   if (width == null) {
     width = height = 0;
   }   
   
   dataString += id + "," + top + "," + left + "," + element_type + "," + width + "px," + height + "px;";
   
   var bottom = parseInt(top) + $(element).height();
   if (bottom > maxBottom) {
     maxBottom = bottom;
   }
   
  });
   
  // This maxBottom value tells us how tall the container needs to be on the node/edit page
  // for this form.
  dataString += "~~maxBottom~~," + maxBottom + "px";
  
  $("#edit-arrange-fields-position-data").val(dataString);

}

function arrangeFieldsConfirmReset() {
  var x = confirm("Are you sure you want to reset the position data for these fields?  This action cannot be undone.");
  return x;
}

function arrangeFieldsPopupEditField(type, field) {
  var popup_url = Drupal.settings.basePath + "arrange-fields/popup-edit-field&type_name=" + type + "&field=" + field;
  var win_title = "myPopupWin";
  var win_options = "height=700,width=700,scrollbars=yes";
  
  var myWin = window.open(popup_url, win_title, win_options);
  myWin.focus();

}

function arrangeFieldsClosePopup() {
  // Closes the popup and saves the form in the opener window.
  opener.arrangeFieldsSavePositions();
  opener.document.getElementById("arrange-fields-position-form").submit();
  window.close();
}