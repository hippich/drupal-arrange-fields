<style>
  .arrange-fields-normal-flow {
    position: static !important;
  }

  .arrange-fields-container-<?php print $fid; ?> { 
    min-height: <?php print $form_data['maxBottom']; ?>; 
  }

  #arrange-fields-form-spacer-<?php print $fid; ?> {
    height: <?php print $form_data['maxBottom']; ?>; 
    width: 100%;
    clear: both;
  }

  <?php foreach ($form_data['draggableElements'] as $el): ?>
    <?php print theme('arrange_fields_draggable_element_css', array('fid' => $fid) + $el); ?>
  <?php endforeach; ?>

  <?php if ($GLOBALS["arrange_fields_editing"] != $form_id): ?>
    #<?php print $fid; ?> {
      border: 0;
      background: none;
    }
    
    #<?php print $fid; ?> .draggable-form-item {
      border: 0;
      background-color: transparent;
    }
  <?php endif; ?>
</style>

<?php foreach ($form_data['draggableElements'] as $el): ?>
  <?php if ( array_key_exists('type', $el) && $el['type'] == 'markup' ): ?>
    <?php print theme('arrange_fields_draggable_element_markup', array('fid' => $fid) + $el); ?>
  <?php endif; ?>
<?php endforeach; ?>
