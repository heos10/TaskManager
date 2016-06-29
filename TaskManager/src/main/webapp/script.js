function validarRegisto(){
	if(document.getElementById("password").value != document.getElementById("password1").value){
		document.getElementById("erro_pass").innerHTML = "Password não coincide!";
        return false;
	}else if(parseInt(document.getElementById("dia").value)<=0){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>30 && parseInt(document.getElementById("mes").value)%2==0 && parseInt(document.getElementById("mes").value) !=8){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>31 && parseInt(document.getElementById("mes").value)%2!=0){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>31 && parseInt(document.getElementById("mes").value) == 8){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>29 && parseInt(document.getElementById("mes").value) == 2 && !bis(parseInt(document.getElementById("ano").value))){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>28 && parseInt(document.getElementById("mes").value) == 2 && !bis(parseInt(document.getElementById("ano").value))){
        document.getElementById("erro_aniversario").innerHTML = "Data não é válida!";
        return false;
    }else{
        return true;
    }

}

function bis(ano){
    if((ano % 4 == 0) && ( (ano % 100 != 0) || (ano % 400 == 0) )){
        return true;
    }else{
        return false;
    }
}