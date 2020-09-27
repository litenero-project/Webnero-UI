$(document).ready(function(){
    ModelViewController.fillData();
});

$(document).on("click", "#send-modal", function(){
    $('.form-group').removeClass("has-error");
    if(checkMandatoryField("amount") && checkMandatoryField("receiver"))
        $("#send-code-modal").modal('show');
});

function checkMandatoryField(id){
    if($("#" + id).val() == ""){
        $("#" + id).closest('.form-group').addClass("has-error");
        return false;
    }
    
    return true;
}

function sendCallback(coinSymbol){
	coinSymbol = 'crfi';
    PassportPipeline.setMethod('send_transaction');
    const coinAmount = $("#amount").val();
    const coinAmountFloat = parseFloat(coinAmount);
    const formatCRFIout = 1000000000000;
    const amountGoingOut = parseInt(coinAmountFloat * formatCRFIout).toFixed(0);
    console.log("coinAmount: " + JSON.stringify(coinAmount));
    console.log("coinAmountFloat: " + coinAmountFloat);
    console.log("amountGoingOut: " + amountGoingOut);
    PassportPipeline.passportParams.amount = amountGoingOut;
    PassportPipeline.passportParams.receiver = $("#receiver").val();
    PassportPipeline.passportParams.pid = $("#pid").val();
   
    const _uuid = PassportPipeline.myDecipher(sessionStorage.getItem(coinSymbol+"_uuid"));
    const _email = PassportPipeline.myDecipher(sessionStorage.getItem("username"));
    const _password = PassportPipeline.myDecipher(sessionStorage.getItem("password"));
	if(_uuid){
        // logs
        console.log(_uuid);
        console.log(_email);
        console.log(_password);
	}
    console.log(PassportPipeline.passportParams)
    
    PassportPipeline.remoteCall(coinSymbol).then((response) => {
        if(response){
            console.log(response); 
		try {var sendResult = JSON.parse(response);
		     	console.log(sendResult)
			console.log(sendResult.data)
			console.log(sendResult.data.error)
		    },
		catch {
			console.log(sendResult)
			console.log(sendResult.data)
			console.log(sendResult.data.error)
		}
            if(sendResult.hasOwnProperty("error")){
		    $("#spinner-modal").modal('hide');
		    $("#fail_modal").modal('show');
		    setTimeout(function(){ $("#fail_modal").modal('hide'); }, 6500) 
		    const message = "Transaction Failed, please try again momentarily";
		    $(".alert-danger").html("Transfer error: " + message);
		    $(".alert-danger").css("display", "block");
		    $(".btn-code").css("display", "block");
	    }
            else {
		    $("#spinner-modal").modal('hide');
		    $("#success_modal").modal('show');
		    var successDoesFollow = function(){ 
			    $("#success_modal").modal('hide'); 
			    location.href = location.href.replace("send", "history");
		    }
		    setTimeout(successDoesFollow(), 6500) 
	    }
        }
    });
}


$(document).on("click", "#send", function(){
    $(".alert").css("display", "none");
    $(".btn-code").css("display", "none");
    if(pin_code.length < 5){
        sendFail("Provide 5 digits code");
    }
    else {
        $("#spinner-modal").modal('show');
        $("#send-code-modal").modal('hide');

        sessionStorage.setItem("code", PassportPipeline.myCipher(pin_code));
        console.log(pin_code);
        // check_code

        var coin_selected = $(".btn-selected").attr("id");
        PassportPipeline.setCode(PassportPipeline.myCipher(pin_code));
	    switch(coin_selected){
		case 'crfi-send':
            return PassportPipeline.performOperation("crfi", sendCallback);
        default:
            break;
	    }
    }     
});




