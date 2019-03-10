$("document").ready(function() {
  const channelsContainer = document.querySelector(".channels");
  const channelNames = [
    "freecodecamp",
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas"
  ];

  // ALERT CONTROL //////////////////////////////////
  //////////////////////////////////////////////////
  const showAlert = function(message) {
    const alert = document.querySelector(".alert");
    alert.innerHTML = message;
    alert.style.display = "block";
  };

  const hideAlert = function() {
    const alert = document.querySelector(".alert");
    alert.style.display = "none";
  };

  // FETCH DATA FROM API //////////////////////////////////
  //////////////////////////////////////////////////
  const getChannelData = function(name, callback) {
    $.getJSON(
      `https://wind-bow.glitch.me/twitch-api/streams/${name}?callback=?`
    )
      .done(data => {
        callback(data);
      })
      .fail((jqxhr, textStatus, error) => {
        let err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });
  };

  // CREATE UI //////////////////////////////////
  //////////////////////////////////////////////////
  const createChannelUI = function(data) {
    if (!data._links) {
      showAlert("Could not fetch data from the server");
      return;
    }

    const linkSplited = data._links.channel.split("/");
    const name = linkSplited[linkSplited.length - 1];
    const div = document.createElement("div");
    div.className = "channel";
    div.id = name;

    // Check if channel is streaming
    if (data.stream !== null) {
      div.setAttribute("data-status", "online");
      div.innerHTML = `<img src="${
        data.stream.channel.logo
      }" alt="offline" class="logo">
      <div class="content">
        <span class="name"><a href="${
          data.stream.channel.url
        }" target="blank">${name}</a></span>
        <p>${data.stream.channel.game} ${data.stream.channel.status}</p>
      </div>
      <i class="fa fa-circle icon-online" aria-hidden="true"></i>`;
    } else {
      div.setAttribute("data-status", "offline");
      div.innerHTML = `<img src="https://d30y9cdsu7xlg0.cloudfront.net/png/90580-200.png" alt="offline" class="logo">
      <div class="content">
        <span class="name">${name}</span>
        <p>Currently not streaming</p>
      </div>
      <i class="fa fa-circle icon-offline" aria-hidden="true"></i>`;
    }

    channelsContainer.appendChild(div);
  };

  // DISPLAY CONTROL //////////////////////////////////
  //////////////////////////////////////////////////
  const displayChannels = function(status) {
    const channels = Array.from(channelsContainer.children);
    channels.forEach(channel => {
      if (channel.getAttribute("data-status") === status) {
        channel.style.display = "flex";
      } else {
        channel.style.display = "none";
      }
    });
  };

  const showOnlineChannels = function() {
    displayChannels("online");
  };

  const showOfflineChannels = function() {
    displayChannels("offline");
  };

  const showAllChannels = function() {
    const channels = Array.from(channelsContainer.children);
    channels.forEach(channel => {
      if (channel.classList.contains("alert")) {
        channel.style.display = "none";
      } else {
        channel.style.display = "flex";
      }
    });
  };

  // SEARCH FUNCTIONALITY ///////////////////////////
  //////////////////////////////////////////////////
  const searchThroughChannels = function() {
    const inputValue = this.value;

    const regexp = new RegExp(inputValue, "gi");

    const filteredChannels = channelNames.filter(name => regexp.test(name));

    const channels = Array.from(channelsContainer.children);

    channels.forEach(channel => {
      if (filteredChannels.includes(channel.id)) {
        channel.style.display = "flex";
      } else {
        channel.style.display = "none";
      }
    });

    displayAlertIfNotFound(channels);
  };

  const displayAlertIfNotFound = function(channels) {
    if (channels.every(channel => channel.style.display === "none")) {
      showAlert("No channels found");
    } else {
      hideAlert();
    }
  };

  const initialize = function(names) {
    names.forEach(name => {
      getChannelData(name, createChannelUI);
    });
  };

  // ADD EVENT LISTENERS ////////////////////////////
  //////////////////////////////////////////////////
  document
    .querySelector(".search")
    .addEventListener("keyup", searchThroughChannels);

  document
    .querySelector(".online")
    .addEventListener("click", showOnlineChannels);

  document
    .querySelector(".offline")
    .addEventListener("click", showOfflineChannels);

  document.querySelector(".all").addEventListener("click", showAllChannels);

  // INITIALIZE APP ////////////////////////////////
  //////////////////////////////////////////////////
  initialize(channelNames);
});
