<?php

$css_markup = '';

$text_label_display = $label_display;
if ($label_display == "inline-block") {
  $text_label_display = "inline-block";
}

if ($type && $type == 'markup') {
  $css_markup .= "
    #$fid #$wrapper_id {
      top: $pos_top;
      left: $pos_left;
      width: $markup_width;
      height: $markup_height;
      z-index: $z_index;
      $wrapper_style
    }
  ";
}

// Add to our CSS markup value...
$css_markup .= "      
  #$fid #$wrapper_id{        
    top: $pos_top;
    left: $pos_left; 
  }
";


// We do not want to try to resize any input fields if this
// is the buttons wrapper.  Otherwise it will mess up our buttons.
// This usually happens when you have CAPTCHA installed.
if ($width != "0px" && $element_type != "" && $element_id == "" && !strstr($wrapper_id, "-vertical-tabs-")) {        
  
  // We do not know the element_id in this situation        
  $css_markup .= "        
    #$fid #$wrapper_id $element_type.form-text, 
    #$fid #$wrapper_id $element_type.form-textarea {
      width: $width;
      height: $height;
    }
    ";
}
else if ($width != "0px" && $element_type != "" && $element_id != "" && !strstr($wrapper_id, "-vertical-tabs-")) {
  
  // We know the element id, which makes this simpler.
  $css_markup .= "
    #$fid #$wrapper_id $element_type#$element_id {
      width: $width;
      ";
  // If this is an input field (not a textarea) we do not need to specify the height.
  // This is hopefully a fix to a bug where, for some users, their textfields get shrunk down
  // to only 1px.
  if ($element_type != "input") {          
    $css_markup .= "
        height: $height;        
      ";        
  }
  
  $css_markup .= "    }        ";
  
}

// Handle any configurations which were set in the configure dialog.
if ($wrapper_width != "") {
  $css_markup .= " #$fid #$wrapper_id { width: $wrapper_width; } ";
}

if ($wrapper_height != "") {
  $css_markup .= "
    #$fid #$wrapper_id { height: $wrapper_height; } 
    #$fid #$wrapper_id fieldset { height: 100%; } 
  ";
}

if ($label_width) {
  $css_markup .= "
    #$fid #$wrapper_id .form-item > label
    {
      width: $label_width;
    }
  ";
}

if ($label_display != "") {
  
  $css_markup .= "
    #$fid #$wrapper_id .form-item label { 
      vertical-align: $label_vertical_align; 
    }
    #$fid #$wrapper_id .form-item > input, 
    #$fid #$wrapper_id .form-item > label,
    #$fid #$wrapper_id .form-item > div,
    #$fid #$wrapper_id .form-item > div.form-radios > div,
    #$fid #$wrapper_id .form-item > div.form-checkboxes > div
    {
      display: $label_display;
    }";

  if ($element_type == "input") {
    // Because of IE, we must do something special if the input
    // is a textfield, which is what this is testing for.
    // Basically, the label cannot have a display of "inline-block",
    // it must simply be "inline."  However, the textfield itself still
    // needs to be "inline-block."  Thanks IE!
    $css_markup .= "
      #$fid #$wrapper_id .form-item > label
      {
        display: $text_label_display;
      }
    ";
  }
  
  
  $css_markup .= "  
    #$fid #$wrapper_id .form-item div.ui-resizable-handle,
    #$fid #$wrapper_id .form-item div.description
    {
      display: block;
    }                          
          ";
}

print $css_markup;
