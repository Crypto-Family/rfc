$(document).ready(function () {

    $(window).scroll(function () {
        if ($(this).scrollTop() > 25) {
            $('header').addClass('sticky');
            $('header').css('transition', '0s');
        } else {
            $('header').removeClass('sticky');
        }
    });

    $('.sandwich-btn').on('click', function (e) {
        if ($(".navigation-menu").hasClass("open")) {
            $(".navigation-menu").removeClass('open');
            $('.navigation-menu .black-layer').css('transition-delay', '0.4s');
            $('.navigation-menu .green-layer').css('transition-delay', '0.8s');
            $('header').css('transition-delay', '0.8s');
            $('header').css("border-bottom", "5px solid var(--primary-color)")
        } else {
            $(".navigation-menu").addClass('open');
            $('.navigation-menu .black-layer').css('transition-delay', '0.4s');
            $('.navigation-menu .green-layer').css('transition-delay', '0s');
            $('header').css('transition-delay', '0.4s');
            $('header').css("border-bottom", "5px solid transparent")
        }
        $(this).toggleClass("open");
    });

    $(".inner a").on("click", function () {
        $('.sandwich-btn').click()
    })

    document.addEventListener("mousemove", function (e) {
        magnetize('.circle', e);
    });

    function magnetize(el, e) {
        var mX = e.pageX,
            mY = e.pageY;
        var items = document.querySelectorAll(el);

        [].forEach.call(items, function (item) {
            var customDist = item.getAttribute('dist') * 20 || 70;
            var centerX = item.offsetLeft + (item.clientWidth / 2);
            var centerY = item.offsetTop + (item.clientHeight / 2);

            var deltaX = Math.floor((centerX - mX)) * -0.45;
            var deltaY = Math.floor((centerY - mY)) * -0.45;

            var distance = calculateDistance(item, mX, mY);

            if (distance < customDist) {
                TweenMax.to(item, 0.3, {
                    y: deltaY,
                    x: deltaX,
                    scale: 1.1
                });
                item.classList.add('magnet');
            } else {
                TweenMax.to(item, 0.45, {
                    y: 0,
                    x: 0,
                    scale: 1
                });
                item.classList.remove('magnet');
            }
        });
    }

    function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offsetLeft + (elem.clientWidth / 2)), 2) + Math.pow(
            mouseY - (elem.offsetTop + (elem.clientHeight / 2)), 2)));
    }

    if ($(".image-frame").length > 0) {

        $(function () {
            //prepare Your data array with img urls
            var dataArray = new Array();
            dataArray[0] = "/imgs/Avatar-01.png";
            dataArray[1] = "/imgs/Avatar-03.png";

            gsap.fromTo(".image-frame img", {
                opacity: 0,
                y: 20
            }, {
                duration: 1,
                opacity: 1,
                y: 0,
                ease: "easeInOut"
            })

            //start with id=0 after 5 seconds
            var thisId = 1;

            setInterval(function () {
                $('.image-frame img').attr('src', dataArray[thisId]);
                gsap.fromTo(".image-frame img", {
                    opacity: 0,
                    y: 20
                }, {
                    duration: 1,
                    opacity: 1,
                    y: 0,
                    ease: "easeInOut"
                })
                thisId++; //increment data array id
                if (thisId > 1) thisId = 0; //repeat from start
            }, 1000);
        })

    }

    $(".faq-question").on("click", function () {
        var current = $(".faq-item.active")
        if (current && $(current).hasClass("active") !== $(this).parent().hasClass("active")) {
            $(current).toggleClass("active")
            $(current).find(".faq-answer").css("max-height", 0)
            $(current).find("i").toggleClass("bx-plus")
            $(current).find("i").toggleClass("bx-minus")
        }

        $(this).parent().toggleClass("active")
        var height = $(this).parent().find(".answer-content").height()
        if ($(this).parent().hasClass("active")) {
            $(this).parent().find(".faq-answer").css("max-height", height)
            $(this).find("i").toggleClass("bx-plus")
            $(this).find("i").toggleClass("bx-minus")
        } else {
            $(this).parent().find(".faq-answer").css("max-height", 0)
            $(this).find("i").toggleClass("bx-minus")
            $(this).find("i").toggleClass("bx-plus")
        }

    })

    var w = 0

    w = $(window).width();

    var elementCount = $('.member').filter(function () {
        return $(this).offset().left > $(".carousel-wrapper").width();
    }).length;

    if (elementCount == 0) {
        $(".carousel-navigation").css("display", "none")
    } else {
        $(".carousel-navigation").css("display", "")
    }

    var moveMember = 0

    $("#right-arrow").on("click", function () {
        var elementCount = $('.member').filter(function () {
            return $(this).offset().left  > $(".carousel-wrapper").width();
        }).length;

        var move = $(".member").width() + 32 + parseInt($(".carousel-wrapper").css("gap").match(/\d+/)[0])

        moveMember += move

        if (elementCount >= 1) {
            gsap.to(".carousel-wrapper", {
                duration: 0.3,
                x: -(moveMember),
                ease: "easeInOut"
            })
        } else {
            gsap.to(".carousel-wrapper", {
                duration: 0.3,
                x: 0,
                ease: "easeInOut"
            })
            moveMember = 0
        }

    })

    $("#left-arrow").on("click", function () {

        var elementCount = $('.member').filter(function () {
            return ($(this).offset().left + $(this).outerWidth())  > $(".carousel-wrapper").width();
        }).length;
        
        var move = $(".member").width() + 32 + parseInt($(".carousel-wrapper").css("gap").match(/\d+/)[0])

        moveMember -= move

        if (moveMember >= 0) {
            gsap.to(".carousel-wrapper", {
                duration: 0.3,
                x: -(moveMember),
                ease: "easeInOut"
            })
        } else {
            gsap.to(".carousel-wrapper", {
                duration: 0.3,
                x: -(move * (elementCount - 1)),
                ease: "easeInOut"
            })
            moveMember = (move * (elementCount - 1))
        }

    })

    var mintNumber = parseInt($("#mint-number").val())

    $("#deduct-mint").on("click", function () {
        if ($("#mint-number").val() > 1) {
            mintNumber -= 1
            $("#mint-number").val(mintNumber)
            console.log(mintNumber)
        }
    })

    $("#add-mint").on("click", function () {
        mintNumber += 1
        $("#mint-number").val(mintNumber)
        console.log(mintNumber)
    })

    $("#mint-number").on("change", function () {
        if ($(this).val() == "" || $(this).val() == 0) {
            $(this).val(1)
        }
        $(this).val(Math.abs($(this).val()))
    })

    $("#mint-now").on("click", function() {
        if($("#mint-number").val() > 0) {
            // YOU CAN MINT 
        }
    })

    $(".tc-container").scroll(function () {
        if ($(".tc-container").scrollTop() + $(".tc-container").height() == $(".tc-container").height()) {
            alert("bottom!");
        }
    })

    $("#tc-btn").on("click", function () {
        $("#tc").css("display", "block")
    })

    $("#tc-close").on("click", function () {
        $("#tc").css("display", "none")
    })

    var boxes = $(".box"),
        stage = $(".stage"),
        $nav = $("#nav");

    var angle = 360 / 6; // 13 is the number of '.box' elements

    TweenLite.set(stage, {
        css: {
            perspective: 900,
            transformStyle: "preserve-3d"
        }
    });

    if(w < 768 &&  w < 768) {
        console.log(spacing)
        var spacing = 240
    } else if (w > 767 && w < 1200 ) {
        var spacing = 240
    } else if (w > 1199 ) {
        var spacing = 320
    }

    boxes.each(function (index, element) {
        TweenLite.set(element, {
            css: {
                // rotationY: index * 360 / 13,
                rotationY: index * angle,
                transformOrigin: "50% 50% -"+spacing
            }
        });

        element.dataset.rotationY = index * angle;

        TweenMax.to(element, 10, {
          css: {
            z:0.01,
            rotationY: "-=359"
          },
          repeat: -1, // 20
          ease: Linear.easeNone
        });
    });

    $(window).resize(function () {

        if (w != $(window).width()) {

            var elementCount = $('.member').filter(function () {
                return $(this).offset().left > $(".carousel-wrapper").width();
            }).length;

            if (elementCount == 0) {
                $(".carousel-navigation").css("display", "none")
            } else {
                $(".carousel-navigation").css("display", "")
            }

            w = $(window).width();

        }

        if(w < 768 &&  w < 768) {
            console.log(spacing)
            var spacing = 240
        } else if (w > 767 && w < 1200 ) {
            var spacing = 240
        } else if (w > 1199 ) {
            var spacing = 320
        }

        boxes.each(function (index, element) {
            TweenLite.set(element, {
                css: {
                    // rotationY: index * 360 / 13,
                    rotationY: index * angle,
                    transformOrigin: "50% 50% -"+spacing
                }
            });
    
            element.dataset.rotationY = index * angle;
    
            TweenMax.to(element, 10, {
              css: {
                z:0.01,
                rotationY: "-=359"
              },
              repeat: -1, // 20
              ease: Linear.easeNone
            });
        });

    })

    $nav.on("click", "#prev", function () {

        TweenMax.staggerTo(boxes, 1, {
            cycle: {
                rotationY: function (index) {
                    var y1 = +this.dataset.rotationY;
                    var y2 = y1 - angle;
                    this.dataset.rotationY = y2;
                    return y2;
                }
            },
            // ease: Linear.easeNone
        }, 0);

        /* TweenMax.to(boxes, 1,{
           //parseTransform:true,
           // rotationY:"-=28",
           rotationY:rot,
           //transform: "rotateY("+rY+"deg) translateZ(-288px)"
           ease: Linear.easeNone
        });*/
    });

    $nav.on("click", "#next", function () {

        TweenMax.staggerTo(boxes, 1, {
            cycle: {
                rotationY: function (index) {
                    var y1 = +this.dataset.rotationY;
                    var y2 = y1 + angle;
                    this.dataset.rotationY = y2;
                    return y2;
                }
            },
            // ease: Linear.easeNone
        }, 0);

        /* TweenMax.to(boxes,1,{
           //parseTransform:true,
           rotationY:"+="+1 * 360 / 13//"+=28"
           //transform: "rotateY("+rY+"deg) translateZ(-288px)"
         });*/
    });

})