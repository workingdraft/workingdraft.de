(function(root, factory){

  "use strict";

  if (typeof define === 'function' && define.amd){
    define(['jquery', 'bacon'], factory);
  }
  else {
    root.wdPlayer = factory(jQuery, Bacon);
  }
})(this, function($, Bacon){

  "use strict";

  // var defaultOptions = {
  //   timelineStyles: {
  //     height: 200,
  //     width: 400
  //   }
  // };


  // Rendering helpers
  // -----------------

  var painter = (function(){
    var ctx, opts;
    return {
      init: function(context, options){
        ctx = context;
        opts = options;
      },
      clear: function(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      },
      drawMouseX: function(x){
        if(x > -1){
          ctx.save();
          ctx.fillStyle = 'black';
          ctx.fillRect(x, 0, 1, ctx.canvas.height);
          ctx.restore();
        }
      },
      drawTime: function(timeData, duration, currentTime){
        ctx.save();
        var current = timeData.length / duration * currentTime;
        ctx.fillStyle = opts.color;
        for(var i = 1; i < timeData.length; i++){
          if(i > current){
            ctx.fillStyle = opts.altColor;
          }
          ctx.fillRect(i, 256 - timeData[i], 1, 256);
        }
        ctx.restore();
      }
    };
  })();


  // Player
  // ------

  return function wdPlayer(options){

    // Require audio sources
    if(typeof options.sources === 'undefined' ||
       Object.keys(options.sources).length === 0){
      throw new Error('No audio sources passed in Player options');
    }

    // Use options defaults
    // TBD


    // DOM construction
    // ----------------

    // Player wrapper
    var $wrapper = $('<div/>').addClass('wdPlayer');

    // Audio element (invisible)
    var $player = $('<audio/>').attr({
      class: 'wdPlayerAudio'
    });

    // Audio sources generated from options
    for(var type in options.sources){
      $('<source>').attr({
        src: options.sources[type],
        type: type
      }).appendTo($player);
    }

    //
    var $time = $('<p>').attr({
      class: 'wdPlayerTime'
    });

    //
    var $timeline = $('<canvas>').attr({
      class: 'wdPlayerTimeline',
      height: options.timelineStyle.height,
      width: options.timelineStyle.width
    });

    //
    var ctx = $timeline[0].getContext('2d');
    painter.init(ctx, options.timelineStyle);

    //
    var $playButton = $('<input>').attr({
      class: 'wdPlayerPlayButton',
      type: 'button'
    });


    // UI mapping
    // ----------

    // Player playing/paused state
    var playerPlaying = Bacon.mergeAll([
      $player.asEventStream('play').map(true),
      $player.asEventStream('pause').map(false)
    ]).toProperty(false);

    // Classes for playing/paused state
    playerPlaying.assign($wrapper, 'toggleClass', 'wdPlayerPlaying');
    playerPlaying.not().assign($wrapper, 'toggleClass', 'wdPlayerPaused');

    // Start playing / pause player
    var playerCommand = $playButton.asEventStream('click').map(playerPlaying);
    playerCommand.onValue(function(currentlyPlaying){
      var playerMethod = (currentlyPlaying ? 'pause' : 'play');
      $player[0][playerMethod]();
    });

    // Map button disabled attribute and wrapper ready class to player ready state
    var playerReady = Bacon.mergeAll([
      $player.asEventStream('canplay').map(true),
      $player.asEventStream('error').map(false)
    ]).toProperty(false);
    playerReady.not().assign($playButton, 'attr', 'disabled');
    playerReady.assign($wrapper, 'toggleClass', 'wdPlayerReady');

    // Map player error class to error event
    $player.asEventStream('error').map(true).toProperty(false).assign($wrapper, 'toggleClass', 'wdPlayerError');

    // Map button value to player start
    playerPlaying.onValue(function(state){
      $playButton.attr('value', state ? 'Pause' : 'Play');
    });

    // Map timeline clicks to player jump commands
    // TBD

    // Map media fragment changes to player jump commands
    // TBD



    // Timeline UI
    // -----------

    // Stream of x coords for mouseovers
    var timelineMouse = Bacon.mergeAll([
      $timeline.asEventStream('mouseout').map(-1),
      $timeline.asEventStream('mousemove').map(function(evt){
        return evt.clientX - $timeline.offset().left;
      })
    ]);

    // Map timeline clicks to player jump commands
    // var timelineClicks = $timeline.asEventStream('click').map(function(evt){
    //   return evt.clientX - $timeline.offset().left;
    // });


    // Timeline rendering
    // ------------------

    // Current player time
    var currentTime = $player.asEventStream('timeupdate').map('.target.currentTime');

    // Map time streams to time box content
    currentTime.toProperty(0).assign($time, 'html');

    // Combined paint events stream
    var paintEvents = Bacon.combineTemplate({
      currentTime: currentTime.toProperty(0),
      mouseX: timelineMouse.toProperty(-1)
    });



    // TODO: real data, requestAnimationFrame, performance...


    // TESTING: create some fake data
    var fakeData = new Uint8Array(options.timelineStyle.width);
    for(var i = 0; i < fakeData.length; i++){
      fakeData[i] = Math.round(Math.random() * 32) + 144;
    }


    paintEvents.onValue(function(data){
      painter.clear();
      painter.drawTime(fakeData, $player[0].duration, data.currentTime);
      painter.drawMouseX(data.mouseX);
    });


    // All done
    // --------

    // Return wrapper with player elements
    return $wrapper.append(
      $timeline,
      $player,
      $time,
      $playButton
    );

  };

});
