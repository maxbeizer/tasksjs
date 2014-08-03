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

        $(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(e) {
          e.preventDefault();
          storageEngine.delete('task', $(e.target).data().taskId, function() {
            $(e.target).parents('tr').remove();
          }, errorLogger);
        });

        $(taskPage).find('#tblTasks tbody').on('click', '.editRow', function(e) {
          $(taskPage).find('#taskCreation').removeClass('not');
          storageEngine.findById('task', $(e.target).data().taskId, function(task) {
            $(taskPage).find('form').fromObject(task);
          }, errorLogger);
        });

        $(taskPage).find('#saveTask').click(function(e) {
          e.preventDefault();
          if ($(taskPage).find('form').valid()) {
            var task = $('form').toObject();
            storageEngine.save('task', task, function() {
              $(taskPage).find('#tblTasks tbody').empty();
              tasksController.loadTasks();
              $(':input').val('');
              $(taskPage).find('#taskCreation').addClass('not');
            }, errorLogger);
          }
        });

        initialized = true;

      }
    },

    loadTasks: function() {
      storageEngine.findAll('task', function(tasks) {
        $.each(tasks, function(index, task) {
          $('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
        });
      }, errorLogger);
    }
  }
}(); // this ensures that the tasksController is a singelton
