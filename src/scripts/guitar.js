document.addEventListener("play", function (e) {
  const audios = document.querySelectorAll("audio");

  audios.forEach(audio => {
    if (audio !== e.target) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}, true);
