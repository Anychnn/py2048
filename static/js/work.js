UP = 0 // Up
RIGHT = 1 // Right
DOWN = 2 // Down
LEFT = 3 // Left

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }

    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

function getOffset(index) {
    return index * 121 + "px"
}

function updateTransform(tile) {
    tile.transform = "transform: translate(" + getOffset(tile.x) + "," + getOffset(tile.y) + ")";
}

function Tile(index) {
    var tile = new Object();
    tile.x = index % 4;
    tile.y = Math.floor(index / 4);
    // tile.init = true;
    tile.value = 0;
    // tile.delete = false;
    updateTransform(tile);
    return tile
}


var app = new Vue({
    el: '#app',
    data: {
        items: [],
        items_array: [],
        // conf: gameStorage.fetch('vue2048-config'),
        conf: {
            score: 0,
            bestScore: 0,
            initTiles: 2,
            totalTiles: 16
        },
        gridSize: 4
        // init: function () {
        //     console.log('init')
        // }
    },
    methods: {
        init: function () {
            data = this.$data
            this.initGrids();
            // this.initTiles();
            // this.updateArrayTiles();
            this.initFromServer();
        },
        auto_play: function () {
            this.init()
            _this = this
            alter_lose = false
            interval = setInterval(function () {
                direction = 0
                var items = _this.$data.items
                _this.postTileWithDirection(direction, function (data) {
                    var change = data.changed
                    var item_num_arr = data.items
                    var lose = data.lose
                    var _score = data.score
                    _this.$data.conf.score = _score
                    _this.$data.conf.bestScore = data.best_score
                    for (var i = 0; i < 16; i++) {
                        items[i].value = item_num_arr[i]
                    }

                    _this.updateTileClasses();

                    if (lose) {
                        clearInterval(interval)
                        if (!alter_lose) {
                            alter_lose = true
                            // _this.$data.conf.bestScore = Math.max(_this.$data.conf.bestScore, _this.$data.conf.score)
                            // _this.$forceUpdate()
                            setTimeout(function () {
                                $('#myModal').modal()
                            }, 2000)
                        }
                    }
                })
            }, 60)
        },
        initFromServer: function () {
            _this = this
            this.$http.post('/init', {'init': true}).then(function (res) {
                // console.log(res)
                this.$data.items = []
                for (var i = 0; i < 16; i++) {
                    this.$data.items.push(new Tile(i));
                }
                for (var i = 0; i < 16; i++) {
                    // this.$data.items.push(new Tile(i));
                    this.$data.items[i].value = res.data.items[i];
                    _this.updateTileClasses()
                }
            })
        },
        updateTileClass: function (tile) {
            if (tile.value == 0) {
                tile.class = 'tile-0';
            } else {
                tile.class = 'tile-' + tile.value;
            }
        },
        initTiles: function () {
            data = this.$data
            this.$data.items = []

            for (var i = 0; i < 16; i++) {
                this.$data.items.push(new Tile(i));
            }

            //随机生成2个tile value=2
            var rand1 = Math.floor(Math.random() * 16);
            var rand2;
            while (rand2 == undefined || rand2 == rand1) {
                rand2 = Math.floor(Math.random() * 16);
            }

            this.genRandomTile(4);

            this.updateTileClasses();
            // this.updateArrayTiles();

        },
        updateTileClasses: function () {
            var items = this.$data.items;
            for (var i = 0; i < 16; i++) {
                this.updateTileClass(items[i]);
            }
        },
        initGrids: function () {
            var arr = [];
            for (var x = 0; x < 4; x++) {
                arr[x] = [];
                for (var y = 0; y < 4; y++) {
                    arr[x][y] = 0;
                }
            }
            this.grid = arr;
        },
        move: function (direction) {
            var items = this.$data.items
            var _this = this
            // console.log('move')
            this.postTileWithDirection(direction, function (data) {
                var change = data.changed
                var item_num_arr = data.items
                var lose = data.lose
                for (var i = 0; i < 16; i++) {
                    items[i].value = item_num_arr[i]
                }

                _this.updateTileClasses();

                if (lose) {
                    $('#myModal').modal()
                }
            })
        },
        postTileWithDirection: function (direction, func) {
            var items = this.$data.items
            this.$http.post('/auto', {
                items: items,
                direction: direction
            }).then(function (res) {
                // console.log(res)
                func(res.data)
            })
        },
        moveTilesWithDirection: function (direction) {
            var change = false;
            var items = this.$data.items

            if (direction == UP) {
                for (var x = 0; x < 4; x++) {
                    for (var index1 = 0; index1 < 4; index1++) {
                        if (items[x + 4 * index1].value == 0) {
                            for (var index2 = index1 + 1; index2 < 4; index2++) {
                                if (items[x + 4 * index2].value != 0) {
                                    items[x + 4 * index1].value = items[x + 4 * index2].value;
                                    items[x + 4 * index2].value = 0;
                                    change = true;
                                    break;
                                }
                            }
                        }

                        if (items[x + 4 * index1].value != 0) {
                            for (var index2 = index1 + 1; index2 < 4; index2++) {
                                if (items[x + 4 * index2].value != 0 && items[x + 4 * index2].value != items[x + 4 * index1].value) {
                                    break;
                                }
                                if (items[x + 4 * index2].value == items[x + 4 * index1].value) {
                                    items[x + 4 * index2].value = 0;
                                    items[x + 4 * index1].value = items[x + 4 * index1].value * 2;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (direction == DOWN) {
                for (var x = 0; x < 4; x++) {
                    for (var index1 = 3; index1 >= 0; index1--) {
                        if (items[x + 4 * index1].value == 0) {
                            for (var index2 = index1 - 1; index2 >= 0; index2--) {
                                if (items[x + 4 * index2].value != 0) {
                                    items[x + 4 * index1].value = items[x + 4 * index2].value;
                                    items[x + 4 * index2].value = 0;
                                    change = true;
                                    break;
                                }
                            }
                        }

                        if (items[x + 4 * index1].value != 0) {
                            for (var index2 = index1 - 1; index2 >= 0; index2--) {
                                if (items[x + 4 * index2].value != 0 && items[x + 4 * index2].value != items[x + 4 * index1].value) {
                                    break;
                                }

                                if (items[x + 4 * index2].value == items[x + 4 * index1].value) {
                                    items[x + 4 * index2].value = 0;
                                    items[x + 4 * index1].value = items[x + 4 * index1].value * 2;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (direction == LEFT) {
                for (var x = 0; x < 4; x++) {
                    for (var index1 = 0; index1 < 4; index1++) {
                        if (items[index1 + 4 * x].value == 0) {
                            for (var index2 = index1 + 1; index2 < 4; index2++) {
                                if (items[index2 + 4 * x].value != 0) {
                                    items[index1 + 4 * x].value = items[index2 + 4 * x].value;
                                    items[index2 + 4 * x].value = 0;
                                    change = true;
                                    break;
                                }
                            }
                        }

                        if (items[index1 + 4 * x].value != 0) {
                            for (var index2 = index1 + 1; index2 < 4; index2++) {

                                if (items[index2 + 4 * x].value != 0 && items[index2 + 4 * x].value != items[index1 + 4 * x].value) {
                                    break;
                                }

                                if (items[index2 + 4 * x].value == items[index1 + 4 * x].value) {
                                    items[index2 + 4 * x].value = 0;
                                    items[index1 + 4 * x].value = items[index1 + 4 * x].value * 2;
                                    change = true;

                                    break;
                                }
                            }
                        }
                    }
                }
            } else if (direction == RIGHT) {
                for (var x = 0; x < 4; x++) {
                    for (var index1 = 3; index1 >= 0; index1--) {
                        if (items[index1 + 4 * x].value == 0) {
                            for (var index2 = index1 - 1; index2 >= 0; index2--) {
                                if (items[index2 + 4 * x].value != 0) {
                                    items[index1 + 4 * x].value = items[index2 + 4 * x].value;
                                    items[index2 + 4 * x].value = 0;
                                    change = true;
                                    break;
                                }
                            }
                        }

                        if (items[index1 + 4 * x].value != 0) {
                            for (var index2 = index1 - 1; index2 >= 0; index2--) {
                                if (items[index2 + 4 * x].value != 0 && items[index2 + 4 * x].value != items[index1 + 4 * x].value) {
                                    break;
                                }

                                if (items[index2 + 4 * x].value == items[index1 + 4 * x].value) {
                                    items[index2 + 4 * x].value = 0;
                                    items[index1 + 4 * x].value = items[index1 + 4 * x].value * 2;
                                    change = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return change;
        },
        genRandomTile: function (num) {
            var items = this.$data.items;
            while (num > 0) {
                index = Math.floor(Math.random() * 16);
                if (Math.floor(Math.random() * 4) >= 3) {
                    if (items[index].value == 0) {
                        items[index].value = 4;
                        num--;
                    }
                } else {
                    if (items[index].value == 0) {
                        items[index].value = 2;
                        num--;
                    }
                }

            }

        },
        checkIfLose: function () {
            var lose = true;
            var items = this.$data.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].value == 0) {
                    return false;
                }
                var x = i % 4;
                var y = Math.floor(i / 4);
                item1 = items[y * 4 + x + 1];
                item2 = items[y * 4 + x - 1];
                item3 = items[(y - 1) * 4 + x];
                item4 = items[(y + 1) * 4 + x];
                // console.log(item3)
                if (x != 3 && items[i].value == item1.value) {
                    return false;
                }
                if (x != 0 && items[i].value == item2.value) {
                    return false;
                }
                if (y != 0 && items[i].value == item3.value) {
                    return false;
                }
                if (y != 3 && items[i].value == item4.value) {
                    return false;
                }
            }
            return lose;
        },
        exists: function (arr, node) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == node) {
                    return true;
                }
            }
        }
    },
    created: function () {
        this.init();
    }
})

// app.$watch('items', function (items) {
//     console.log('items')
// })

var Keys = new KeyboardInputManager();


Keys.on('move', function (direction) {
    // console.log('game move' + direction)
    app.move(direction);
});