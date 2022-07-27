
const getplaylist = document.querySelector(".playlist");
const playbtn = document.querySelector(".btn-toggle-play");
const heading = document.querySelector(".songName");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const progress = document.querySelector("#progress");
const nextbtn = document.querySelector(".btn-next");
const prevbtn = document.querySelector(".btn-prev");
const repeatbtn = document.querySelector(".btn-repeat");
const randombtn = document.querySelector(".btn-random");
const menubtn = document.querySelector(".menubtn");
const menubar = document.querySelector(".menubar");
const lammo = document.querySelector(".player");
const exitbtn = document.querySelector(".exit");
const songActive = document.querySelector(".song.activeSongCurrent");

const app = {
  currentindex: 0,
  isPlaying: true,
  isActive: false,
  isRepeat: false,
  isMenuAppear: false,
  songs: [
    {
      name: "An hà kiều",
      singer: "Trần Gia Đoàn",
      path: "./music/anhakieu.mp3",
      image: "./img/anh1.jpg",
    },
    {
      name: "Bạch nguyệt quang và nốt chu sa",
      singer: "Đại Từ",
      path: "./music/bach nguyet quang.mp3",
      image: "./img/anh2.jpg",
    },
    {
      name: "Bến thượng hải",
      singer: "thang",
      path: "./music/ben thuong hai.mp3",
      image: "./img/anh3.jpg",
    },
    {
      name: "Giữ chặt cậu",
      singer: "Nhất Khẩu Điềm",
      path: "./music/giu chat cau.mp3",
      image: "./img/anh4.jpg",
    },
    {
      name: "Thanh ti",
      singer: "Đẳng Thập Yêu Quân",
      path: "./music/thanh ti.mp3",
      image: "./img/anh5.jpg",
    },
    {
      name: "Hạ sơn",
      singer: "Yếu Bất Yếu Mãi Thái",
      path: "./music/ha son.mp3",
      image: "./img/hason.jpg",
    },
    {
      name: "Hoa cài mái tóc",
      singer: "NB3 Bảo",
      path: "./music/hoa cai mai toc.mp3",
      image: "./img/hoacaimaitoc.jpg",
    },
    {
      name: "Quan sơn tửu",
      singer: "Đẳng thập ma quân",
      path: "./music/quan son tuu.mp3",
      image: "./img/quansontuu.jpg",
    },
    {
      name: "Tô mạc già",
      singer: "Lão Bạch",
      path: "./music/to mac gia.mp3",
      image: "./img/tomacgia.jpg",
    },
    {
      name: "Yến vô hiết",
      singer: "Tưởng tuyết nhi",
      path: "./music/yen vo hiet.mp3",
      image: "./img/yenvohiet.jpg",
    },
  ],

  render: function () {
    const rend = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentindex ? "activeSongCurrent" : ""
        }" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <div class="title"> ${song.name}</div>
                <div class="author"> ${song.singer}</div>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `;
    });
    getplaylist.innerHTML = rend.join("");
  },

  handleEvents: function () {
    const _this = this;
    // xu ly quay cd thumb
    const cdthimbanimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 15000,
        iterations: Infinity,
      }
    );
    cdthimbanimate.pause();

    //xu ly khi scroll phong to thu nho
    const cd = document.querySelector(".cd");
    const cdwidth = cd.offsetWidth;
    document.onscroll = function () {
      
     const scrolltop = window.scrollY;
     console.log(scrolltop);
      if(scrolltop>0){
        cd.style.display = 'none';
        cd.style.transition = 0.3;
      }else{
        cd.style.display = 'block';
        cd.style.transition = 0.3;
      }
    };

    //xu ly khi nhan nut play
    const start = document.querySelector(".player");
    playbtn.onclick = function () {
      if (_this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };
    audio.onplay = function () {
      _this.isPlaying = false;
      start.classList.add("playing");
      //cdThumb.classList.add('cdrotate');
      cdthimbanimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = true;
      start.classList.remove("playing");
      //cdThumb.classList.remove('cdrotate');
      cdthimbanimate.pause();
    };

    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //xu ly khi tua bai hat
    progress.onchange = function (e) {
      const seektime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seektime;
    };

    //xu ly khi next bai hat
    nextbtn.onclick = function () {
      if (_this.isActive) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      app.render();
      _this.scrollActiveView();
    };

    //xu ly khi prev bai hat
    prevbtn.onclick = function () {
      if (_this.isActive) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      app.render();
      _this.scrollActiveView();
    };

    //xu ly khi het bai tu dong chuyen bai ke tiep or repeat
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextbtn.click();
      }
    };

    //xu ly khi random bai hat
    randombtn.onclick = function () {
      _this.isActive = !_this.isActive;
      randombtn.classList.toggle("activeRandomBtn", _this.isActive);
    };

    //xu ly hanh dong khi repeat bai hat
    repeatbtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatbtn.classList.toggle("activeRepeatBtn", _this.isRepeat);
    };

    //xu ly khi click vao bai hat
    getplaylist.onclick = function (e) {
      if (
        e.target.closest(".song:not(.activeSongCurrent)") &&
        !e.target.closest(".option")
      ) {
        //console.log(e.target);
        if (e.target.closest(".song:not(.activeSongCurrent)")) {
          _this.currentindex = Number(
            e.target.closest(".song:not(.activeSongCurrent").dataset.index
          );
          _this.loadcurrentsong();
          audio.play();
          app.render();
        }
      }
    };

    //xu ly lhi click menu button
    menubtn.onclick = function () {
      _this.isMenuAppear = !_this.isMenuAppear;
      menubar.classList.toggle("menu_appear", _this.isMenuAppear);
      lammo.classList.toggle("content_opacity", _this.isMenuAppear);
    };

    exitbtn.onclick = function () {
      _this.isMenuAppear = !_this.isMenuAppear;
      menubar.classList.toggle("menu_appear", _this.isMenuAppear);
      lammo.classList.toggle("content_opacity", _this.isMenuAppear);
    };
  },

  //-------------------------------------------------------------

  defineproperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentindex];
      },
    });
  },

  loadcurrentsong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentindex++;
    if (this.currentindex > this.songs.length - 1) {
      this.currentindex = 0;
    }
    this.loadcurrentsong();
  },

  prevSong: function () {
    this.currentindex--;
    if (this.currentindex < 0) {
      this.currentindex = this.songs.length - 1;
    }
    this.loadcurrentsong();
  },

  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentindex === newIndex);
    this.currentindex = newIndex;
    this.loadcurrentsong();
  },

  scrollActiveView: function () {
    setTimeout(() => {
      songActive.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },

  start: function () {
    this.defineproperties();
    this.loadcurrentsong();
    this.handleEvents();
    this.nextSong();
    this.prevSong();
    this.render();
  },
};

app.start();
