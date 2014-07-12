tasksController = function() {
  var taskPage;
  var initialized = false;
  return {
    init: function(page) {
      if (!initialized) {
        taskPage = page;

        $('[required="required"]').prev('label').append( "<span>*</span>" ).children('span').addClass('required');

        $('tbody tr.even').addClass('even');

        $('#btnAddTask').click(function(e) {
          e.preventDefault();
          $('#taskCreation').removeClass('not');
        });

        $('tbody tr').click(function(e) {
          $(e.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
        });

        $('#tblTasks tbody').on('click', '.deleteRow', function(e) {
          e.preventDefault();
          $(e.target).parents('tr').remove();
        });

        $('#saveTask').click(function(e) {
          e.preventDefault();
          var task = $('form').toObject();
          $('#taskRow').tmpl(task).appendTo($('#tblTasks tbody'));
        });

        initialized = true;

      }
    }
  }
}(); // this ensures that the tasksController is a singelton
