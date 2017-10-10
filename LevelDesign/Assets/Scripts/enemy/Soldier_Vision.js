#pragma strict

private var soldier : Soldier ;

function Start () 
{
	soldier = GameObject.Find("Soldier").GetComponent.<Soldier>() ;
}

function OnTriggerEnter(col : Collider)
{
	if(col.gameObject.tag == "Player")
	{
		soldier.Sight() ;
	}
}
