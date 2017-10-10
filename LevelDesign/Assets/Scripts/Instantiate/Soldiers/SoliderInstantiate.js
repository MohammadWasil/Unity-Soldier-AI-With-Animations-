#pragma strict

public var pointsArray : Transform[] ;
public var soldier : GameObject ;


function Start () {
	var i : int ;
	for(i = 0 ; i <=pointsArray.Length ; i++)
	{
		Instantiate( soldier, pointsArray[i].position, pointsArray[i].rotation) ;
	}
}

function Update () 
{
	
}
