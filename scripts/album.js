var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}
var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};
// assignment 21, part 1
// did I wrap the filterTimeCode function properly?
var setCurrentTimeInPlayerBar = function(currentTime)  {
  $('.current-time').text(filterTimeCode(currentTime));
}
// assignment 21, part 2
var setTotalTimeInPlayerBar = function(totalTime) {
  $('.total-time').text(filterTimeCode(totalTime));
}
// assignment 21, part 3
// this works properly in the main body/not the player bar
var filterTimeCode = function(timeInSeconds) {
  parseFloat(timeInSeconds);
  var wholeMinutes = Math.floor(timeInSeconds / 60);
  var wholeSeconds = Math.floor(timeInSeconds - (wholeMinutes * 60));
  if (wholeSeconds < 10) {
    wholeSeconds = "0" + wholeSeconds;
  }
  return (wholeMinutes + ":" + wholeSeconds);

}
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {
       var songNumber = parseInt($(this).attr('data-song-number'));

       if (currentlyPlayingSongNumber !== null) {
         var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      //   console.log($currentlyPlayingCell);
         $currentlyPlayingCell.html(currentlyPlayingSongNumber);
       }
       if (currentlyPlayingSongNumber !== songNumber) {
         setSong(songNumber);
         currentSoundFile.play();
         updateSeekBarWhileSongPlays();

         var $volumeFill = $('.volume .fill');
         var $volumeThumb = $('.volume .thumb');
         $volumeFill.width(currentVolume + '%');
         $volumeThumb.css({left: currentVolume + '%'});

         $(this).html(pauseButtonTemplate);
         updatePlayerBarSong();
       } else if (currentlyPlayingSongNumber === songNumber) {
        //  $(this).html(playButtonTemplate);
        //  $('.main-controls .play-pause').html(playerBarPlayButton);
        // currentlyPlayingSongNumber = null;
        // currentSongFromAlbum = null;
        // if the current sound file is paused, when it is clicked, it will play. if not it will pause
          if (currentSoundFile.isPaused()) {
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
          } else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
          }
       }
     };

     var onHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));
       // var songNumber = getSongNumberCell(songNumberCell);
       if (songNumber !== currentlyPlayingSongNumber) {
           songNumberCell.html(playButtonTemplate);
       }
     };
    //  var getSongNumberCell = function(number) {
    //    return $('.song-item-number[data-song-number="' + number + '"]');
    //  }
     var offHover = function(event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));
       if (songNumber !== currentlyPlayingSongNumber) {
         songNumberCell.html(songNumber);
       }
    //   console.log(songNumber);
    //   console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};
var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      // assignment 21, part 1
      // why isn't the time formatting correctly? not adjusting to "X:XX"
      setCurrentTimeInPlayerBar(this.getTime());
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    if ($(this).parent().attr('class') === 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {

    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($seekBar.parent().attr('class') === 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  var lastSongNumber = parseInt(currentlyPlayingSongNumber);
  // console.log("This is current song index: ");
  // console.log(currentSongIndex);
  // console.log("This is currentAlbum.songs.length: ")
  // console.log(currentAlbum.songs.length);
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  //currentlyPlayingSongNumber = currentSongIndex + 1;
  //currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + parseInt(currentlyPlayingSongNumber) + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + parseInt(lastSongNumber) + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  // console.log("This is current song index in previous song");
  // console.log(currentSongIndex);
  // console.log("This is the album length in previous song");
  // console.log(currentAlbum.songs.length);
  var lastSongNumber = parseInt(currentlyPlayingSongNumber);

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  // currentlyPlayingSongNumber = currentSongIndex + 1;
  // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  // var setSong = function(songNumber) {
  //   currentlyPlayingSongNumber = parseInt(songNumber);
  //   currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  // var $nextSongNumberCell = $('.song-item-number[data-song-number="' + parseInt(currentlyPlayingSongNumber) + '"]');
  // var $lastSongNumberCell = $('.song-item-number[data-song-number="' + parseInt(lastSongNumber) + '"]');
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  // assignment 21, part 2
  // what argument should I be passing in to "setTotalTimeInPlayerBar"? I know I want the song's total duration, but I'm not sure what to pass in to get that
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
  // console.log(currentSongFromAlbum);
}
// assignment 20 work below
// if a song is paused and the play button is clicked in the player bar:
// change the song number cell from play to pause button,
// change the html of the player bar's play button to pause button and
// play the song
// if the song is playing(current sound file exists) and the pause button is clicked:
// change the song number cell from a pause button to a play button
//change the html of the player bar's pause button to a play button and
// pause the song
// if (currentSoundFile.isPaused()) {
//   $(this).html(pauseButtonTemplate);
//   $('.main-controls .play-pause').html(playerBarPauseButton);
//   currentSoundFile.play();
// } else {
//   $(this).html(playButtonTemplate);
//   $('.main-controls .play-pause').html(playerBarPlayButton);
//   currentSoundFile.pause();

var toggleFromPlayerBar = function() {
  if (currentSoundFile.isPaused()) {
    $(this).html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
  } else {
    $(this).html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
// assignment 20 variable
var $mainControls = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    // line below: assignment 20 variable: a variable to hold the "$('.main-controls .play-pause')" selector
    // add a click event with toggleFromPlayerBar() as the event handler
    $mainControls.click(toggleFromPlayerBar);
});
