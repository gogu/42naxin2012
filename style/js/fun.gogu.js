jQuery(document).ready(function($) {
    var Depart = Backbone.Model.extend({
        urlRoot: "",
        defaults: {
            "id": 0,
            "title": "",
            "shortTitle": "",
            "titleIMG": "",
            "poster": "",
            "intro": "",
            "duty": "",
            "article": {
                "basic": [
                ],
                "advante": [
                ]
            }
        }
    });

    var DepartList = Backbone.Collection.extend({
        url: "data.json",
        model: Depart
    });

    var DepartList = new DepartList;

    var DepartDir = Backbone.View.extend({
        tagName: "li",
        template: function(data) {
            var temp = '<a class="dir-item" href="#depart{{id}}">{{title}}</a>';
            return Mustache.to_html(temp, data);
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            'click .dir-item': 'scroll'
        },
        scroll: function() {
            var _this = this.el.getElementsByTagName("a")[0];
            var $target = $(_this.hash);

            $("#depart-dir a").removeClass("here");
            $(_this).addClass("here");
            
            if ($target.length) {
                var targetOffset = $target.offset().top - 136;
                $('html,body').animate({scrollTop: targetOffset},300);
                return false;
            }
        }
    });

    var DepartView = Backbone.View.extend({
        className: "depart-style",
        template: function(data) {
            var temp = $('.depart-temp').html();
            return Mustache.to_html(temp, data);
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            'click #switch': 'switchControl',
            'click #join': 'showForm'
        },
        state: false,
        switchControl: function() {
            var article = $(this.el).find("#depart-article"),
                switcher = $(this.el).find("#switch");
            if (!this.state) {
                article.slideDown(200);
                switcher.addClass("switch-close");
                switcher.text("收起");
                this.state = true;
            } else {
                article.slideUp(200);
                switcher.removeClass("switch-close");
                switcher.text("展开查看详情");
                this.state = false;
            }
        },
        showForm: function() {
            departName = this.model.get("title");

            $("#depart").val(departName);
            FormView.show();

        }
    });

    var FormView = Backbone.View.extend({
        el: $("#depart-form"),
        events: {
            'click #form-cancel': 'cancel',
            'submit form': 'checkAll',
            'keyup input': 'overWr'
        },
        show: function() {
            var top = $(window).scrollTop();

            $(this.el).css("top", top - 60).fadeIn(200);
            $("#behind").fadeIn(200);
        },
        cancel: function() {
            $(this.el).fadeOut(200);
            $("#behind").fadeOut(200);
        },
        checkAll: function() {
            var n_name = $("#uname"),
                n_depart = $("#depart"),
                n_ph = $("#phone"),
                n_email = $("#email"),
                n_intro = $("#intro"),
                n_realize = $("#realize");

            var reg = /^[\u4e00-\u9fa5]{2,4}$/;
            if (!reg.test(n_name.val())) {
                alert("请填写正确中文姓名");
                n_name.focus().select();
                n_name.addClass("wrong");
                return false;
            }       
                        
            var reg = /^[1][0-9]{10}$/;
            if (!reg.test(n_ph.val())) {
                alert("请填写正确手机号码");
                n_ph.focus().select();
                n_ph.addClass("wrong");
                return false;
            }
            
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if (!reg.test(n_email.val())){
                alert("请填写正确的邮箱地址");
                n_email.focus().select();
                n_email.addClass("wrong");
                return false;
            }
            
            if (n_intro.val().length <= 0){
                alert("请填写自我评价");
                n_intro.focus().select();
                n_intro.addClass("wrong");
                return false;
            }
            
            if (n_realize.val().length <= 0){
                alert("请填写自我介绍");
                n_realize.focus().select();
                return false;
            }
        },
        wrong: function(area) {
            $('input[type="text"]').addClass("wrong");
        },
        overWr: function() {
            $('input[type="text"]').removeClass("wrong");            
        }
    });
    var FormView = new FormView || FormView.show();

    var Cover = Backbone.View.extend({
        el: $("#cover"),
        initialize: function() {
            $(".nav").clone().prependTo(this.el);
            $(".wrap").addClass("hidden");
        },
        events: {
            'click #enter': 'enter'
        },
        enter: function() {
            $(this.el).animate({left: "-100%"}, 500, function(){ $(this).hide() });
            $(".wrap").removeClass("hidden");
        }
    });
    var Cover = new Cover;

    var AppView = Backbone.View.extend({
        el: $("#depart-contain"),

        initialize: function() {
            DepartList.bind('reset', this.addAll, this);
            DepartList.bind('all',   this.render, this);
            DepartList.fetch();

        },
        addOne: function(data){
            var viewDepart = new DepartView({model: data});
            $("#depart-contain").append(viewDepart.render().el);
            var viewDir = new DepartDir({model: data});
            $("#depart-dir ul").append(viewDir.render().el);
        },
        addAll: function() {
            DepartList.each(this.addOne);
        }
    });

    new AppView();
});