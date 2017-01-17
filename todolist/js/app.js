var filters={
  all:function (todos) {
    return todos;
  },
  active:function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed;
    })
  },
  completed:function (todos) {
    return todos.filter(function (todo) {
      return todo.completed;
    })

  }
};

var app=new Vue({
  el:".todoapp",
  data:{
    todos: todoStorage.fetch(),
    newTodo: '',
    editedTodo: null,
    visibility: 'all'
  },
  watch:{
    todos:{
      deep:true,
      handler:todoStorage.save
    }
  },
  computed:{
    filteredTodos: function () {
      return filters[this.visibility](this.todos);
    },
    remaining:function () {
      return filters.active(this.todos).length
    },
    allDone:{
      get:function () {
        return this.remaining===0
      },
      set:function (value) {
        this.todos.forEach(function (todo) {
          todo.completed=value;
        })
      }
    }
  },
  methods:{
    addTodo:function () {
      var value=this.newTodo&&this.newTodo.trim();
      if(!value){ return ;}
      this.todos.push({ title: value, completed: false})
      this.newTodo="";
    },
    removeTodo:function (todo) {
      var index=this.todos.indexOf(todo);
      this.todos.splice(index,1)
    },
    pluralize: function (word, count) {
      return word + (count === 1 ? '' : 's');
    },
    removeCompleted:function () {
      this.todos = filters.active(this.todos);
    },
    editTodo:function (todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
      console.log(todo)
    },
    doneEdit:function (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        //this.removeTodo(todo);
        this.cancelEdit(todo);
      }
    },
    cancelEdit:function (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    }
  },
  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }

})