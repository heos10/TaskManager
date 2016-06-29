/*
variáveis globais

lista -> array de e-mails seleccionados 
xmldoc -> conteudo do ficheiro xml (para evitar passar sempre como parametro)
*/

var lista = new Array();
var mails;
var xmldoc;
function lerFicheiroXML(code)
{
	  var request = null;
	if (window.XMLHttpRequest != null)
    request = new XMLHttpRequest();
	else if (window.ActiveXObject != null)
		request = new ActiveXObject("Microsoft.XMLHTTP");
	request.onreadystatechange=function()
	{
		if(request.readyState==4)
		{
			xmldoc = request.responseXML;
			switch(code)
			{
			 case 0:break;
			 case 1:preencher(code);break;
			 case 2:preencher(code);break;
			 case 3:preencher(code);break;
			 case 4:getContactos();break;
			}
		}
	}
	request.open("GET","dados.xml",true);
	request.send();
}
/*
função: verifica_user
argumentos: nenhum

Serve para verificar se o utilizador introduzido e a respectiva password estão de acordo com o que está guardado no ficheiro xml.

*/
function verifica_user()
{
	var email=document.getElementById("email").value;
	var password=document.getElementById("password").value;
	var mail= xmldoc.getElementsByTagName("utilizador")[0].getElementsByTagName("username")[0].firstChild.nodeValue;
	var pass= xmldoc.getElementsByTagName("utilizador")[0].getElementsByTagName("password")[0].firstChild.nodeValue;
	if(email==mail && password==pass)
	{
		return true;
	}else{
		alert("Username ou password inválidos.");
		return false;
	}
}

/*
função: getContactos
argumentos: nenhum

Serve para listar os contactos na div principal (conteudo) em que estes serão clicáveis chamando assim a 
função showUserInfo(x) onde x é a posição do contacto no ficheiro xml.

*/

function getContactos()
{
	var conteudo=document.getElementById("conteudo");
	contactos=xmldoc.getElementsByTagName("pessoa");
	conteudo.innerHTML="<div id='toolbox'><table ><tr><td id='table_toolbox'><a href='#' title='procurar' onclick='showSearchInput()'><input type='image' src='search.png'></input></a></td><td><input id='search_bar' onchange='search_contact()' type='search'></input></tr></table></div>";

	for(x=0;x<contactos.length;x++)
	{
		
		conteudo.innerHTML+="<a href='#' class='mail'onclick='showUserInfo("+x+")'><div class='foto'><img class='foto' src='"+contactos[x].getElementsByTagName("foto")[0].firstChild.nodeValue+"'><span class='texto'>"+contactos[x].getElementsByTagName("nome")[0].firstChild.nodeValue+" "+contactos[x].getElementsByTagName("apelido")[0].firstChild.nodeValue+"</span></div></a>";
	}
}

function search_contact()
{
	var texto_procura = document.getElementById("search_bar").value;
	var conteudo= document.getElementById("conteudo");
	conteudo.innerHTML="<div id='toolbox'><table ><tr><td id='table_toolbox'><a href='#' title='procurar' onclick='showSearchInput()'><input type='image' src='search.png'></input></a></td><td><input id='search_bar' onchange='search_contact()' type='search'></input></tr></table></div>";
var contactos = xmldoc.getElementsByTagName("pessoa");
	for(x=0;x<contactos.length; x++){
		nome= contactos[x].getElementsByTagName("nome")[0].firstChild.nodeValue+" "+contactos[x].getElementsByTagName("apelido")[0].firstChild.nodeValue;
		if(nome.toLowerCase().contains(texto_procura.toLowerCase())){
		conteudo.innerHTML+="<a href='#' class='mail'onclick='showUserInfo("+x+")'><div class='foto'><img class='foto' src='"+contactos[x].getElementsByTagName("foto")[0].firstChild.nodeValue+"'><span class='texto'>"+nome+"</span></div></a>";
		}
	}

}


/*
função: preencher
argumentos: code -> código identificador da pasta onde se encontra o utilizador (i.e pasta clicada pelo utilizador)

Serve para listar os e-mails que estão na pasta clicada pelo utilizador

*/


function preencher(code)
{
	nome_utilizador=xmldoc.getElementsByTagName("utilizador")[0].getElementsByTagName("username")[0].firstChild.nodeValue;
	document.getElementById("utilizador").innerHTML=nome_utilizador;
	imagem_utilizador=xmldoc.getElementsByTagName("utilizador")[0].getElementsByTagName("imagem")[0].firstChild.nodeValue;
	document.getElementById("span_imagem").style.backgroundImage="url('"+imagem_utilizador+"')";
	switch(code)
	{
		case 1: var pasta = "receber";break;
		case 2: var pasta = "enviados";break;
		case 3: var pasta = "rascunhos";break;
	}	
	mails= xmldoc.getElementsByTagName(pasta);
	var texto="<div id='toolbox'><table ><tr><td><a href='#' title='novo e-mail'onclick='newmail()'><input type='image' src='add.png'></input></a></td><td><a href='#' onclick='eliminar_mails("+code+")' title='eliminar e-mails'><input type='image' src='delete.png'></input></a></td><td id='table_toolbox'><a href='#' title='procurar' onclick='showSearchInput()'><input type='image' src='search.png'></input></a></td><td><input id='search_bar' onchange='search("+code+")' type='search'></input></tr></table></div>";

	texto+="<table class='mails'><tr><th></th><th class='remetente'>Remetente</th><th class='assunto'>Assunto</th><th class='data'>Data</th></tr>";
	for(var x=1;x<mails[0].childNodes.length; x=x+2){
		var origem =mails[0].childNodes[x].childNodes[1].firstChild.nodeValue; // mail -> origem -> texto ->valor
		var assunto = mails[0].childNodes[x].childNodes[7].firstChild.nodeValue; // mail -> destino -> texto ->valor
		var data = mails[0].childNodes[x].childNodes[5].childNodes[1].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[3].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[5].firstChild.nodeValue; // mail -> destino -> texto ->valor
		texto=texto+"<tr class='mails'><td><input type='checkbox' onclick='verifica("+x+")'></input></td><td class='remetente'><a class='mail' href='#' onclick='replymail("+code+","+x+")'>"+ origem+"</a></td>"+"<td class='assunt'><a class='mail'href='#' onclick='showmail("+code+","+x+")'>"+assunto+"</a></td><td class='data'>"+data+"</td></a></tr>";	
	}
document.getElementById("conteudo").innerHTML=texto+"</table>";

}
/*
função: showSearchInpit
argumentos: nenhum

Mostra/Esconde a div correspondente ao input para fazer pesquisa de e-mails

*/


function showSearchInput()
{
	var x=document.getElementById('search_bar');
	if(x.style.display!="block")
	{
		x.style.display="block";
	}else{
		x.style.display="none";
	}
	x.focus();
}
/*
função: anexarFicheiros
argumentos: nenhum

Gatilho do evento anexar ficheiros para um botão análogo

*/

function anexarFicheiros()
{
	document.getElementById('anexo').click();
}
/*
função: adicionarAnexo
argumentos: nenhum

função que simula o envio de ficheiros para o servidor mostrando-os numa div denominada 'anexos'

*/



function adicionarAnexo()
{
	var a= document.getElementById("anexo");
	if(a.value!="")
	{
		document.getElementById("anexos").innerHTML+="<p>"+a.value+"</p>";
	}
	a.value="";
}

/*
função: newmail
argumentos: code -> codigo da pasta , x -> codigo do e-mail ao qual vamos fazer FORWARD

Caso não seha especificado code e x então é tratado como se fosse um novo e-mail.
Caso contrário esta função vai buscar ao xml o assunto e a mensagem a ser reenviada.

*/

function newmail(code,x)
{
	if(code!=undefined && x!=undefined)
	{
	document.getElementById("popup_email").style.display="none";
	switch(code)
	{
		case 1: var pasta="receber";break;
		case 2: var pasta="enviados";break;
		case 3: var pasta="rascunhos";break;
	}
 	var mails= xmldoc.getElementsByTagName(pasta);
	var assunto ="FORWARD:"+ mails[0].childNodes[x].childNodes[7].firstChild.nodeValue;
	var msg="FORWARD MESSAGE:"+"<br>"+mails[0].childNodes[x].childNodes[9].firstChild.nodeValue;
	
	}else{
		var msg="";
		var assunto="";
	}
	var conteudo=document.getElementById("conteudo");
	conteudo.innerHTML="<form action='#' method='GET'><div id='toolbox'><table><tr><td><a href='#' title='guardar rascunho'onclick='create_mail()'><input type='image' src='save.png' value='Guardar' alt='Guardar rascunho'></input></a></td><td><a href='#' title='anexar ficheiros' onclick ='anexarFicheiros()'><input type='image' src='upload.png'  Value='Anexar' alt='Anexar ficheiros'></input></a></td><td><a href='#' title='enviar'><input type='image' src='check.png' value='Enviar' alt='Enviar mensagem'></input></a></td></tr></table></div><table class='novo'><tr><td class='label'><label for='destinatario'>Para:</label></td><td><input class='campos' required type='email' name='destinatario' id='destinatario'></input></td></tr><tr><td class='label'><label for='assunto'>Assunto:</label></td><td><input class='campos' required type='text' name='assunto' id='assunto'></input></td></tr><tr class='msg'><td class='label'><label for='mensagem'>Mensagem:</label></td><td><textarea required name='mensagem' class='msg' id='mensagem'>"+msg+"</textarea></td></tr><tr><td class='label'><label for='anexo'>Anexo:</label></td><td><input class='campos' type='file' id='anexo' onchange='adicionarAnexo()' name='anexo'></input></td></tr><tr><td></td><td name='anexos' id='anexos'></td></table></form>";
	document.getElementById("assunto").value=assunto;
}	
/*
função: replymail
argumentos: code-> codigo da pasta,x -> codigo do email

Serve para responder a um e-mail.
Esta função vai buscar ao e-mail do destinatario à mensagem que iniciou o evento.

*/


function replymail(code,x)
{
	hide_popup_email();
	switch(code)
	{
		case 1: var pasta="receber";break;
		case 2: var pasta="enviados";break;
		case 3: var pasta="rascunhos";break;
	}
 	var mails= xmldoc.getElementsByTagName(pasta);
 	var remetente=mails[0].childNodes[x].childNodes[1].firstChild.nodeValue;
 	var assunto ="RE:"+ mails[0].childNodes[x].childNodes[7].firstChild.nodeValue;
	var conteudo=document.getElementById("conteudo");
	conteudo.innerHTML="<form action='#' method='GET'><div id='toolbox'><table><tr><td><a href='#' title='guardar rascunho' onclick='create_mail()'><input type='image' src='save.png' value='Guardar' alt='Guardar rascunho'></input></a></td><td><a href='#' title='anexar ficheiro' onclick ='anexarFicheiros()'><input type='image' src='upload.png' Value='Anexar' alt='Anexar ficheiros'></input></a></td><td><a href='#' title='enviar'><input type='image' src='check.png' value='Enviar' alt='Enviar mensagem'></input></a></td></tr></table></div><table class='novo'><tr><td class='label'><label for='destinatario'>Para:</label></td><td><input class type='email' required name='destinatario' id='destinatario'></input></td></tr><tr><td class='label'><label for='assunto'>Assunto:</label></td><td><input type='text' name='assunto' id='assunto'></input></td></tr><tr class='msg'><td class='label'><label for='mensagem'>Mensagem:</label></td><td><textarea class='msg' required name='mensagem' id='mensagem'></textarea></td></tr><tr><td class='label'><label for='anexo'>Anexo:</label></td><td><input type='file' id='anexo' onchange='adicionarAnexo()' name='anexo'></input></td></tr><tr><td></td><td name='anexos' id='anexos'></td></table></form>";
	document.getElementById("destinatario").value=remetente;
	document.getElementById("assunto").value=assunto;

}
/*
função: newmail_contact
argumentos: x -> id do contacto

Serve para enviar um e-mail através dos contactos, servindo-se do identificador do contacto no xml (x) para procurar pelo e-mail respectivo.

*/



function newmail_contact(x)
{
	hide_popup();
 	var remetente=xmldoc.getElementsByTagName("pessoa")[x].getElementsByTagName("mail")[0].firstChild.nodeValue;
	conteudo.innerHTML="<form action='#' method='GET'><div id='toolbox'><table><tr><td><a href='#' onclick='create_mail()'><input type='image' src='save.png' value='Guardar' alt='Guardar rascunho'></input></a></td><td><a href='#'><input type='image' src='upload.png'  onclick ='anexarFicheiros()' Value='Anexar' alt='Anexar ficheiros'></input></a></td><td><a href='#'><input type='image' src='check.png' value='Enviar' alt='Enviar mensagem'></input></a></td></tr></table></div><table class='novo'><tr><td class='label'><label for='destinatario'>Para:</label></td><td><input class type='email' required name='destinatario' id='destinatario'></input></td></tr><tr><td class='label'><label for='assunto'>Assunto:</label></td><td><input type='text' name='assunto' id='assunto'></input></td></tr><tr class='msg'><td class='label'><label for='mensagem'>Mensagem:</label></td><td><textarea class='msg' required name='mensagem' id='mensagem'></textarea></td></tr><tr><td class='label'><label for='anexo'>Anexo:</label></td><td><input type='file' id='anexo' onchange='adicionarAnexo()' name='anexo'></input></td></tr><tr><td></td><td name='anexos' id='anexos'></td></table></form>";
	document.getElementById("destinatario").value=remetente;
}


/*
função: showmail
argumentos: code -> codigo da pasta , x -> codigo do e-mail seleccionado

Serve para procurar o e-mail numa dada pasta e mostrar o seu conteudo.


*/



function showmail(code,x)
{
	switch(code)
	{
		case 1: var pasta="receber";break;
		case 2: var pasta="enviados";break;
		case 3: var pasta="rascunhos";break;
	}
 	var mails= xmldoc.getElementsByTagName(pasta);
	var popup=document.getElementById("popup_email");
	popup.innerHTML="<a href='#' onclick='hide_popup_email()'><span id='popup_fechar'></span></a>";
	var remetente=mails[0].childNodes[x].childNodes[1].firstChild.nodeValue;
	var destinatario=mails[0].childNodes[x].childNodes[3].firstChild.nodeValue;
	var data = mails[0].childNodes[x].childNodes[5].childNodes[1].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[3].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[5].firstChild.nodeValue;
	var assunto = mails[0].childNodes[x].childNodes[7].firstChild.nodeValue;
	var msg= mails[0].childNodes[x].childNodes[9].firstChild.nodeValue;
	var anexos= mails[0].childNodes[x].childNodes[11].childNodes.length;
	popup.innerHTML+="<div id='toolbox'><table><tr><td><a href='#' title='responder'onclick='replymail("+code+","+x+")'><input type='image' src='back.png' value='Responder' alt='Responder'></input></a></td><td><a href='#' title='reenviar' onclick ='newmail("+code+","+x+")'><input type='image' src='next.png'  Value='Reenviar' alt='Reenviar E-mail'></a></td><td><a href='#' title='eliminar' onclick='eliminar_mail("+code+","+x+")'><input type='image' src='delete.png' value='Eliminar' alt='Eliminar mensagem'></input></a></td><td><a href='#' title='adicionar contacto aos favoritos' onclick='alert(\"not implemented\")'><input type='image' src='favs.addto.png' value='favoritos' alt='adicionar aos favoritos'></input></a></td></tr></table></div>";
	popup.innerHTML+="<table><tr><td class='title'>De:</td><td>"+remetente+"</td></tr><tr><td class='title'>Para:</td><td>"+destinatario+"</td><tr><td class='title'>Data:</td><td>"+data+"</td></tr><tr><td class='title'>Assunto:</td><td>"+assunto+"</td></tr><tr><td class='title'>Mensagem:</td><td>"+msg+"</td></tr></table>";
	for(var y=1;y<anexos;y=y+2)
	{
	var anexo_nome= mails[0].childNodes[x].childNodes[11].childNodes[y].childNodes[1].firstChild.nodeValue;
	var anexo_url= mails[0].childNodes[x].childNodes[11].childNodes[y].childNodes[3].firstChild.nodeValue;
	popup.innerHTML+="<span id='popup_anexo'><a target='_blank' href='"+anexo_url+"'>"+anexo_nome+"</a></span>";
	}
	popup.style.display="block";
}

/*
função: search
argumentos: code -> codigo da pasta onde sera efectuada a procura

Serve para filtrar os e-mails de uma determinada pasta por e-mail do remetende, assunto ou data.

*/



function search(code)
{
 	var texto_procura= document.getElementById("search_bar").value;
	switch(code)
	{
		case 1: var pasta="receber";break;
		case 2: var pasta="enviados";break;
		case 3: var pasta="rascunhos";break;
	}
 	var mails= xmldoc.getElementsByTagName(pasta);
	var texto="<div id='toolbox'><table ><tr><td><a href='#' onclick='newmail()'><input type='image' src='add.png'></input></a></td><td><a href='#' onclick='eliminar_mails("+code+")'><input type='image' src='delete.png'></input></a></td><td id='table_toolbox'><a href='#' onclick='showSearchInput()'><input type='image' src='search.png'></input></a></td><td><input id='search_bar'  onchange='search("+code+")' type='search'></input></tr></table></div>";
	texto+="<table class='mails'><tr><th></th><th class='remetente'>Remetente</th><th class='assunto'>Assunto</th><th class='data'>Data</th></tr>";
	for(var x=1;x<mails[0].childNodes.length; x=x+2){
		var origem =mails[0].childNodes[x].childNodes[1].firstChild.nodeValue; // mail -> origem -> texto ->valor
		var assunto = mails[0].childNodes[x].childNodes[7].firstChild.nodeValue; // mail -> destino -> texto ->valor
		var data = mails[0].childNodes[x].childNodes[5].childNodes[1].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[3].firstChild.nodeValue+"-"+mails[0].childNodes[x].childNodes[5].childNodes[5].firstChild.nodeValue; // mail -> destino -> texto ->valor
		if(origem.toLowerCase().contains(texto_procura.toLowerCase()) || assunto.toLowerCase().contains(texto_procura.toLowerCase()) || data.toLowerCase().contains(texto_procura.toLowerCase())){
		texto=texto+"<tr class='mails'><td><input type='checkbox' onclick='verifica("+x+")'></input></td><td class='remetente'><a class='mail' href='replymail("+code+","+x+")'>"+ origem+"</a></td>"+"<td class='assunto'><a class='mail'href='#' onclick='showmail("+code+","+x+")'>"+assunto+"</a></td><td class='data'>"+data+"</td></a></tr>";	
		}
	}
	document.getElementById("conteudo").innerHTML=texto+"</table>";

}

/*
função: create_mail
argumentos: nenhum

serve para adicionar temporariamente ao xml o email criado

*/

function create_mail()
{
	var x= xmldoc.createElement("mail");
	var remetente=xmldoc.createTextNode("origem");
	remetente.nodeValue="pedroafonsodias@ua.pt"
	x.appendChild(remetente);
	var destinatario=xmldoc.createTextNode("destino");
	destinatario.nodeValue=document.getElementById("destinatario").value;
	x.appendChild(remetente);
	x.appendChild(destinatario);
	var rascunhos= xmldoc.getElementsByTagName("rascunhos")[0];
	rascunhos.appendChild(x);
}
/*
função: hide_popup_email
argumentos: nenhum

Serve para esconder o popup gerado pelo showmail

*/

function hide_popup_email()
{
	document.getElementById('popup_email').style.display='none';
}

/*
função: verifica
argumentos: element


*/


function verifica(element)
{
	if(!contains(element))
	{
		lista[lista.length]=element;
	}else{
		lista=remove(element);
	}
}

/*
função: eliminar_mails
argumentos: code-> codigo da pasta

serve para simular a eliminação de vários e-mails de uma pasta

*/


function eliminar_mails(code)
{
	switch(code)
	{
		case 1: var folder="receber";break;
		case 2: var folder="enviados";break;
		case 3: var folder="rascunhos";break;
	}
	alert("Eliminar mails:["+lista+"]\nPasta:"+folder);
}


/*
função: eliminar_mail
argumentos: code -> codigo da pasta, x-> codigo do email

elimina (simula a eliminação) o email que é mostrado no showmail

*/

function eliminar_mail(code,x)
{
	switch(code)
	{
		case 1: var folder="receber";break;
		case 2: var folder="enviados";break;
		case 3: var folder="rascunhos";break;
	}
	alert("Eliminar mail:"+x+"\nPasta:"+folder);
}

/*
função: contains
argumentos: element -> id do mail no xml

verifica se o id existe na lista e retorna esse resultado

*/


function contains(element)
{
	var result=false;;
	for(var x=0;x<lista.length;x++)
	{
		if(lista[x]==element)
		{
			result=true;
		}
	}
	return result;
}

/*
função: remove
argumentos: element

elimina os emails deseleccionados da lista

*/


function remove(element)
{
	var index=0;
	var temp=new  Array();
	for(var x=0;x<lista.length;x++)
	{
		if(lista[x]!=element)
		{
			temp[index]=lista[x];
			index++;
		}
	}
	return temp;
}
/*
função: hide_popup
argumentos: nenhum

esconde a div popup

*/
function hide_popup()
{
	document.getElementById("popup").style.display="none";
}

/*
função: showSupportForm
argumentos: nenhum

Mostra um formulário de suporte 

*/


function showSupportForm()
{
	var popup= document.getElementById("popup");
	popup.innerHTML="<a href='#' onclick='hide_popup()'><span id='popup_fechar_suporte'></span></a>";
	popup.innerHTML+="<form method='GET'><h1>Suporte</h1><table class='novo'><tr><td class='label'><label for='assunto'>Assunto:</label></td><td><input type='text' required name='assunto' id='assunto'></input></td></tr><tr class='msg'><td class='label'><label for='mensagem'>Mensagem:</label></td><td><textarea required class='suporte'name='mensagem' id='mensagem'></textarea></td></tr><tr><td></td><td class='direito'><a href='#' onclick='submitSuport()'><input type='image' class='direito'src='check_black.png'></input></td></tr></table></form>";
	popup.style.display="block";
}


/*
função: showSettings
argumentos: nenhum

Mostra um popup com as informações pessoais do utilizador actual e um botão para fazer logout

*/

function showSettings()
{
	var popup= document.getElementById("popup");
	utilizador= xmldoc.getElementsByTagName("utilizador")[0];
	nome= utilizador.getElementsByTagName("nome")[0].firstChild.nodeValue;
	nome_utilizador=utilizador.getElementsByTagName("username")[0].firstChild.nodeValue;
	curso= utilizador.getElementsByTagName("curso")[0].firstChild.nodeValue;
	apelido= utilizador.getElementsByTagName("apelido")[0].firstChild.nodeValue;
	imagem= utilizador.getElementsByTagName("imagem")[0].firstChild.nodeValue;
	popup.innerHTML="<a href='#' onclick='hide_popup()'><span id='popup_fechar_suporte'></span></a>";
	popup.innerHTML+="<h1>Utilizador</h1><table><tr><td class='title'>Username: </td><td>"+nome_utilizador+"</td></tr><td class='title'>Nome: </td><td>"+nome+" "+apelido+"</td></tr><tr><td class='title'>Curso: </td><td>"+curso+"</td></tr></table>";
	popup.innerHTML+="<img class='imagem_utilizador'src="+imagem+">";
	popup.innerHTML+="<a href='index.html'><input type='image' src='back_black.png' value='Logout' alt='logout'></input></a>";
	popup.style.display="block";
}

/*
função: showUserInfo
argumentos: x -> codigo do contacto no xml

mostra as informações do contacto seleccionado

*/


function showUserInfo(x)
{
	var popup= document.getElementById("popup");
	utilizador= xmldoc.getElementsByTagName("pessoa")[x];
	nome= utilizador.getElementsByTagName("nome")[0].firstChild.nodeValue;
	nome_utilizador=utilizador.getElementsByTagName("mail")[0].firstChild.nodeValue;
	apelido= utilizador.getElementsByTagName("apelido")[0].firstChild.nodeValue;
	imagem= utilizador.getElementsByTagName("foto")[0].firstChild.nodeValue;
	popup.innerHTML="<a href='#' onclick='hide_popup()'><span id='popup_fechar_suporte'></span></a>";
	popup.innerHTML+="<h1>Utilizador</h1><table><tr><td class='title'>Nome: </td><td>"+nome+" "+apelido+"</td></tr><td class='title'>E-mail: </td><td>"+nome_utilizador+"</td></tr></table>";
	popup.innerHTML+="<img class='imagem_utilizador'src="+imagem+">";

	popup.innerHTML+="<table><tr><td><a href='#' onclick='newmail_contact("+x+")'><input type='image' src='mail.png' value='Enviar' alt='Enviar mail'></input></a></td><td><a href='#' onclick='delete_contact("+x+")'><input type='image' src='delete_black.png' value='Eliminar' alt='Eliminar contacto'></input></a></td></tr></table>";
	popup.style.display="block";
}
/*
função: delete_contact
argumentos: x -> codigo do contacto no xml

simula a eliminação de um contacto através de uma mensagem.

*/
function delete_contact(x)
{
	var mail=xmldoc.getElementsByTagName("pessoa")[x].getElementsByTagName("mail")[0].firstChild.nodeValue;
	alert("Remove contacto:["+x+"]\nE-mail:"+mail);
}


/*
função: validarRegisto
argumentos: nenhum

Permite a verificação dos dados introduzidos no registo para que não sejam introduzidos valores sem sentido.

*/


function validarRegisto(){
	document.getElementById("erro_pass").innerHTML = "";
	document.getElementById("erro_aniversario").innerHTML = "";
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
    }else if(parseInt(document.getElementById("dia").value)>29 && parseInt(document.getElementById("mes").value) == 2 && bis(parseInt(document.getElementById("ano").value))){
        document.getElementById("erro_aniversario").innerHTML = "A data não é válida!";
        return false;
    }else if(parseInt(document.getElementById("dia").value)>28 && parseInt(document.getElementById("mes").value) == 2 && !bis(parseInt(document.getElementById("ano").value))){
        document.getElementById("erro_aniversario").innerHTML = "Data não é válida!";
        return false;
    }else{
        return true;
    }

}

/*
função: bis
argumentos: ano -> ano a verificar

Verifica se um ano é bisexto.

*/

function bis(ano){
    if((ano % 4 == 0) && ( (ano % 100 != 0) || (ano % 400 == 0) )){
        return true;
    }else{
        return false;
    }
}