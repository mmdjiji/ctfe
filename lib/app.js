let problemId = 0, catId = 0;
let problemSet = [];
const addCategory = (name) => {
  catId = 0;
  let problems = document.getElementById("problems");
  let category = document.createElement("h2");
  category.innerHTML = name;
  problems.appendChild(category);
}
const addProblem = (problem) => {
  const theId = problemId++;
  problemSet.push(problem);
  let problems = document.getElementById("problems");
  if(catId && catId % 4 === 0){
    let br = document.createElement("br");
    problems.appendChild(br);
    br = document.createElement("br");
    problems.appendChild(br);
  }
  catId++;
  let component = Vue.extend({
    render(createElement) {
      return createElement('el-button', {
        class: 'problem',
        attrs: {
          id: `p${theId}`,
          type: 'primary'
        },
        on: {
          click(){
            app.$options.methods.openProblem(theId);
          }
        }
      }, problem.title);
    },
    data() {
      return {}
    }
  });
  let add = new component().$mount().$el;
  problems.appendChild(add);
}
const loadProblem = () => {
  let request = new XMLHttpRequest();
  request.open("get", "problems.json");
  request.send(null);
  request.onload = () => {
    if (request.status == 200) {
      let recvProblem = JSON.parse(request.responseText);
      let data = [];
      for(let i = 0; i < recvProblem.length; i++) {
        if(!data[recvProblem[i].category]) {
          let arr = [];
          arr.push(recvProblem[i]);
          data[recvProblem[i].category] = arr;
        }else {
          data[recvProblem[i].category].push(recvProblem[i])
        }
      }

      for(let i in data) {
        addCategory(i);
        for(let j in data[i]) {
          addProblem({
            title: data[i][j].title,
            category: data[i][j].category,
            intro: data[i][j].intro,
            flag: data[i][j].flag
          });
        }
      }
    }
  }
}
const app = new Vue({
  el: '#app',
  data: function() {
    return {
      show_pid: 0,
      show_visible: false,
      show_title: '',
      show_intro: '',
      show_flag: '',
      show_md5flag: ''
    }
  },
  mounted() {
    this.onload();
  },
  methods: {
    onload: () => {
      loadProblem();
    },
    openProblem(id) {
      app.show_title = problemSet[id].title;
      app.show_intro = problemSet[id].intro;
      app.show_flag = '';
      app.show_pid = id;
      app.show_md5flag = problemSet[id].flag;
      app.show_visible = true;
    },
    onSubmit() {
      let flag = this.show_flag;
      if(md5(flag) === this.show_md5flag){
        this.$notify({
          title: 'flag正确',
          message: `恭喜你作答正确题目: ${this.show_title}`,
          type: 'success'
        });
        let oldClass = document.getElementById(`p${this.show_pid}`).getAttribute("class");
        let newClass = oldClass.replace('primary', 'success');
        document.getElementById(`p${this.show_pid}`).setAttribute("class", newClass);
        this.show_visible = false;
      }else{
        this.$notify.error({
          title: 'flag错误',
          message: '请重试'
        });
        this.show_flag = '';
      }
    }
  }
});