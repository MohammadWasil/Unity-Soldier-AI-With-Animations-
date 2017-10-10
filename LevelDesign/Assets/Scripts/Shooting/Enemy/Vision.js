#pragma strict

private var enem : Enemy ;

function Start () 
{
	enem = GameObject.FindWithTag("Enemy").GetComponent.<Enemy>(); 
}

function Update () 
{

}

function OnTriggerEnter(Col : Collider)
{
	if(Col.gameObject.tag == "Player")
	{	
		enem.visionSight() ;
	}
}