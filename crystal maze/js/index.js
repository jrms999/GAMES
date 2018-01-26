var $segs;
var angle = 0;
var segments = 36;
var rings = 4;
var cnt;
var i;
var error_snd;
var angle = Array(rings);
var angleSpeed = Array(rings);
var done = false;

function setupSegments() {
    var wrap = document.getElementById("wrap");
    var scale = 1.3;
    var opac = 0.5;
    angleSpeed[0] = 3.0;
    angleSpeed[1] = -3.0;
    angleSpeed[2] = 2.5;
    angleSpeed[3] = -2.5;
    for (var r = 0; r < rings; r++) {
        angle[r] = 0;
        var ring = document.createElement("div");
        ring.className = "ring";
        var hide = false;
        for (var s = 0; s < segments; s++) {
            var segment = document.createElement("div");
            var cn = "seg";
            var change_p = hide ? 0.5 : 0.3;
            if (Math.random(1.0) < change_p) hide = !hide;
            if (hide) cn += " hide";
            if (Math.random(1.0) < 0.1) cn += " long";
            segment.className = cn;
            segment.title = ring;
            ring.insertBefore(segment, null);
        }
        $(ring).css("transform", "scale(" + scale + ")");
        ring.style.opacity = opac;
        opac += 0.15;
        scale *= 0.7;
        wrap.insertBefore(ring, null);
    }
}

function rep_ex() {
    for (var j = 0; j < rings; j++) {
        angle[j] += angleSpeed[j];
        if (angle[j] >= 360) angle[j] -= 360;
    }
    cnt = 0;
    $('.seg').each(function () {
        var index = Math.floor(cnt / segments);
        var a = angle[index] + (360 / segments) * cnt;
        $(this).css("transform", "rotate(" + a + "deg)");
        cnt++;
    });
    var a = (Math.PI * angle[0]) / 45.0;
    a = Math.sin(a) / 4 + 0.8;
    $('#win').css("transform", "scale(" + a + ")");
}

function init() {
    $('#wrap').html("");
    $('#reset').css("display", "none");
    $('#win').mouseenter(function () {
        fail(false);
    });
    setupSegments();
    error_snd = document.getElementById("fail");
    $('.seg').each(function () {
        $(this).css("transform-origin", "50% 200px");
        $(this).mouseenter(function () {
            fail(true)
        });
    });
    i = setInterval(rep_ex, 30);
    done = false;
}

function fail(play) {
    if (done) return;
    window.clearTimeout(i);
    if (play) error_snd.play();
    else alert("You Win");
    $('#reset').css("display", "block");
    done = true;
}

$(document).ready(init);