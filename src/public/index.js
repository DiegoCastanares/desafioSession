const socket = io();
let user = {};
const form = document.getElementById("productForm");
const input = document.getElementById("chatInput");
const chatLog = document.getElementById("msgLog");

const userLoged = {
  author: {},
  text: {},
};

const userInfo = async () => {
  const { value: formValues } = await new swal({
    title: "Log in",
    html:
      "<label>First name:</label>" +
      '<input id="swal-input1" class="swal2-input">' +
      "<label>Last Name:</label>" +
      '<input id="swal-input2" class="swal2-input">' +
      "<label>Age:</label>" +
      '<input id="swal-input3" class="swal2-input">' +
      "<label>Alias:</label>" +
      '<input id="swal-input4" class="swal2-input">' +
      "<label>Avatar:</label>" +
      '<input id="swal-input5" class="swal2-input">' +
      "<label>Email:</label>" +
      '<input id="swal-input6" class="swal2-input">',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      userLoged.author.first_name =
        document.getElementById("swal-input1").value;
      userLoged.author.last_name = document.getElementById("swal-input2").value;
      userLoged.author.age = document.getElementById("swal-input3").value;
      userLoged.author.alias = document.getElementById("swal-input4").value;
      userLoged.author.avatar = document.getElementById("swal-input5").value;
      userLoged.author.id = document.getElementById("swal-input6").value;
      user.user = document.getElementById("swal-input6").value;
    },
  });
  if (formValues) {
    console.log(formValues);
  }
};

userInfo();

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    inputValue = input.value.trim();
    user.message = inputValue;
    socket.emit("message", user);
    userLoged.text.message = input.value.trim();
    socket.emit("userInfo", userLoged);
    input.value = "";
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let info = {};
  formData.forEach((val, key) => (info[key] = val));
  socket.emit("sendProduct", info);
  form.reset();
});

socket.on("msgLog", (dataChat) => {
  console.log(dataChat);
  let messages = "";
  dataChat.forEach((message) => {
    console.log(message);
    messages += `
                    <div class="chatMessage">
                        <p class="email">${message.user}:</p>
                        <p class="time">${message.time}</p>
                        <p class="message">${message.message}</p>
                    </div>
                    `;
  });
  chatLog.innerHTML = messages;
});

socket.on("productLog", (products) => {
  const productos = products.payload;
  const productsTemplate = document.getElementById("productsTemplate");
  fetch("templates/products.handlebars")
    .then((res) => {
      return res.text();
    })
    .then((template) => {
      const processedTemplate = Handlebars.compile(template);
      const html = processedTemplate({
        productos,
      });
      productsTemplate.innerHTML = html;
    });
});
