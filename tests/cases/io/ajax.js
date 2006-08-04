Test.addCase('JAM.IO.Ajax',{
    testReturn : function(){
        new JAM.Ajax('text.txt',{ onComplete: function(R){
            var T = R.responseText;
            this.assertEqual(T,'ajax is my biyatch');
        }});
    }
});
