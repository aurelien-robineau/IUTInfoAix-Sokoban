( function () {
    "use strict";
    $(document).ready( function () {

        let currentLevel = null;

        function isIterable(obj) {
          // checks for null and undefined
          if (obj == null) {
            return false;
          }
          return typeof obj[Symbol.iterator] === 'function';
        } // isIterable ()

        class Level {
            constructor(name, tab, destination) {
                this.name = name;
                this.tab = tab;
                this.destination = destination;
                this.playerPos = this.getPlayerPosition();
            } // constructor ()

            getPlayerPosition() {
                for(let y = 0; y < this.tab.length; y++) {
                    for(let x = 0; x < this.tab[y].length; x++) {
                        if(this.tab[y][x] === '@')
                            return [x, y];
                    }
                }
                return null;
            } // getPlayerPosition ()

            draw() {
                currentLevel = this;
                $('.table').remove();
                let tab = $('<div class="table"></div>');

                for (let row of this.tab) {
                    let tr = $('<div class="row"></div>');
                    tab.append(tr);

                      for (let col of row) {
                          if(col === ' ')
                              col = '&nbsp;';

                          let type;
                          switch (col) {
                              case '@':
                                  type = 'player'
                                  break;
                              case '$':
                                  type = 'rock'
                                  break;
                              case '.':
                                  type = 'dest'
                                  break;
                              case '*':
                                  type = 'placedRock'
                                  break;
                              case '#':
                                  type = 'wall'
                                  break;
                              case '&nbsp;':
                                  type = 'empty'
                                  break;
                              default:
                                  type = 'unknown'
                          }

                          tr.append($('<div class="col ' + type + '"></div>'));
                      } // for each col
                } // for each row

                tab.appendTo(this.destination);
            } // draw ()

            createButton(position) {
                let self = this;
                position.append($('<button></button>').append(this.name).click(
                  function() {
                    self.draw()
                  }
                ));
            } // createButton ()

            up() {
                this.tab[ this.playerPos[1]   ][ this.playerPos[0] ] = ' ';
                this.tab[ this.playerPos[1]++ ][ this.playerPos[0] ] = '@';

                this.draw();
            } // up ()
        } // class Level

        $('body').keydown(function (event) {
            if(currentLevel != null) {
                const keyCode = event.which;
                switch (keyCode) {
                    case 90:
                        currentLevel.up();
                        break;
                    case 81:
                        left();
                        break;
                    case 83:
                        down();
                        break;
                    case 68:
                        right();
                        break;
                    default:
                        break;
                }
            }
        });

        for(let level in levels.levels) {
            let map = new Level(level, levels.levels[level].cells, $('body'));
            map.createButton($('body'));
        }
    });
})();
