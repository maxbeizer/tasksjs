tasksController = function() {
  var taskPage;
  var initialized = false;

  function errorLogger(errorCode, errorMessage) {
    console.log(errorCode + ': ' + errorMessage);
  }

  return {
    init: function(page) {
      storageEngine.init(function() {
        storageEngine.initObjectStore('task', function() {
        }, errorLogger)
      }, errorLogger);

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
          if ($(taskPage).find('form').valid()) {
            var task = $('form').toObject();
            storageEngine.save('task', task, function(savedTask) {
              $('#taskRow').tmpl(savedTask).appendTo($(taskPage).find('#tblTasks tbody'));
            }, errorLogger);
          }
        });

        initialized = true;

      }
    }
  }
}(); // this ensures that the tasksController is a singelton
