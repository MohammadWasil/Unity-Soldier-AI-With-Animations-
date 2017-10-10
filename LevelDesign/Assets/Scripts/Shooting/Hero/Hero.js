#pragma strict
//@ShowInInspector
public var heroHealth : int = 30 ;
public var shoot : boolean ;

function Start () 
{
	shoot = false ;
}

function Update () 
{

	if(shoot == true)
	{
		if(heroHealth <= 0 )
		{
			
			//you die!!!
			//Destroy(gameObject);
			//GameObject.Find("Main Camera").GetComponent.<Mouse Look>().enabled = false ;
			Debug.Log("YOU DIE") ;
			heroHealth = 0 ;	
		}	

		shoot = false ;
	}
}