$(document).ready(() => {
    let turn = 1;
    highlight();
    let cells = [
        [-10, -10, -10],
        [-10, -10, -10],
        [-10, -10, -10]
    ];
    let stop = false;
    let win;
    let clickCount = 0;

    $("#playerInfo div span").click(function () {
        ($(this).text() === "Player") ? $(this).text("Computer"): $(this).text("Player");
        if ($(this).text() === "Computer" && parseInt($(this).attr("data-side")) === turn)
            setTimeout(auto, 1000);
    });

    $(".cell").click(function () {
        if ($(this).text() === "" && !stop) {
            const val = parseInt($(this).attr("data-cell"));
            if (turn === 1 && $("#x span").text() === "Player") {
                $(this).text("X");
                cells[parseInt(val / 3)][val % 3] = turn;
                turn = 0;
                highlight();
                clickCount++;
                if (checkResult() && $("#o span").text() === "Computer")
                    setTimeout(auto, 1000);
            } else if (turn === 0 && $("#o span").text() === "Player") {
                $(this).text("O");
                cells[parseInt(val / 3)][val % 3] = turn;
                turn = 1;
                highlight();
                clickCount++;
                if (checkResult() && $("#x span").text() === "Computer")
                    setTimeout(auto, 1000);
            }

        }
    });

    function checkResult() {
        const sum = [];
        sum[0] = [cells[0][0], cells[0][1], cells[0][2]];
        sum[1] = [cells[1][0], cells[1][1], cells[1][2]];
        sum[2] = [cells[2][0], cells[2][1], cells[2][2]];
        sum[3] = [cells[0][0], cells[1][0], cells[2][0]];
        sum[4] = [cells[0][1], cells[1][1], cells[2][1]];
        sum[5] = [cells[0][2], cells[1][2], cells[2][2]];
        sum[6] = [cells[0][0], cells[1][1], cells[2][2]];
        sum[7] = [cells[0][2], cells[1][1], cells[2][0]];
        for (let i = 0; i < sum.length; i++) {
            const total = sum[i].reduce((plus, item) => plus + item);
            if (total === 3 || total === 0) {
                win = total;
                stop = true;
                $(".cell").css({
                    "cursor": "not-allowed"
                });
                $("#result").hide().text(`${(win === 3) ? "X" : "O"} WIN. Click here to restart.`).show(500);
                return false;
            }
        }
        if (clickCount === 9) {
            stop = true;
            $(".cell").css({
                "cursor": "not-allowed"
            });
            $("#result").hide().text("DRAW. Click here to restart.").show(500);
            return false;
        }
        return sum;
    }

    $("#result").click(() => {
        cells[0].length = 0;
        cells[1].length = 0;
        cells[2].length = 0;
        clickCount = 0;
        cells = [
            [-10, -10, -10],
            [-10, -10, -10],
            [-10, -10, -10]
        ];
        $(".cell").each(function () {
            $(this).text("");
        });
        stop = false;
        turn = (win === 3) ? 1 : 0;
        highlight();
        $("#result").hide(200).text("Reset").show(200);
        $(".cell").css({
            "cursor": "pointer"
        });
        if ($(`#${turn === 1 ? 'x' : 'o'} span`).text() === "Computer")
            setTimeout(auto, 1000);
    });

    function auto() {
        const sum = checkResult();
        const arr = [
            ['00', '01', '02'],
            ['10', '11', '12'],
            ['20', '21', '22'],
            ['00', '10', '20'],
            ['01', '11', '21'],
            ['02', '12', '22'],
            ['00', '11', '22'],
            ['02', '11', '20']
        ];
        if (xo([
                [cells[1][1], cells[0][0]]
            ], [
                ['11', '00']
            ], a => a === -10, 2)) {
            return;
        }
        if (xo(sum, arr, a => a === turn, 2)) {
            return;
        }
        if (xo(sum, arr, a => a === (1 - turn), 2)) {
            return;
        }
        if (xo(sum, arr, a => a === (1 - turn) || a === -10, 3)) {
            return;
        }
        if (xo(sum, arr, a => a === turn, 1)) {
            return;
        }

    }

    function xo(sum, arr, func, k) {
        const rand = [0];
        if (sum.length > 2) {
            for (var i = 0; i < sum.length; i++) {
                rand[i] = i;
            }
            rand.sort((a, b) => 0.5 - Math.random());
        }
        for (let m = 0, i = rand[m]; m < sum.length; i = rand[++m]) {
            if (sum[i].filter(func).length >= k)
                for (let j = 0; j < sum[i].length; j++)
                    if (sum[i][j] !== 1 && sum[i][j] !== 0) {
                        $(`.${parseInt(arr[i][j][0]) * 3 + parseInt(arr[i][j][1])}`).text((turn === 1) ? 'X' : 'O');
                        cells[parseInt(arr[i][j][0])][parseInt(arr[i][j][1])] = turn;
                        turn = 1 - turn;
                        highlight();
                        clickCount++;
                        checkResult();
                        if (sum.length > 0 && $(`#${turn === 1 ? 'x' : 'o'} span`).text() === "Computer")
                            setTimeout(auto, 1000);
                        return true;
                    }
        }
        return false;
    }

    function highlight() {
        $(`#${turn === 1 ? 'x' : 'o'}`).css({
            "border": "2px dotted red"
        });
        $(`#${turn === 0 ? 'x' : 'o'}`).css({
            "border": "none"
        });
    }
});