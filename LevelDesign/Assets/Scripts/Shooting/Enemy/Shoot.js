#pragma strict

public var currentDistance : int ;
public var range : int = 1000 ;

private var enem : Enemy ;
private var heroHealth : Hero ;

function Start () 
{
	enem = GameObject.FindWithTag("Enemy").GetComponent.<Enemy>() ;
	heroHealth = GameObject.Find("Hero").GetComponent.<Hero>() ;
}

function Update () 
{
}

function Shoot()
{
	if(enem.health >= 0)
	{	
		var hit : RaycastHit ;
		if(Physics.Raycast(transform.position, transform.TransformDirection(Vector3.left), hit ))
		{	
			Debug.Log( " " + hit.collider.gameObject.name) ;
			if(hit.collider.gameObject.tag == "Player")
			{
				currentDistance = hit.distance ;
				if(currentDistance <= range)
				{
					heroHealth.heroHealth -= 3 ;
					heroHealth.shoot = true ;
				}
			}
		}
	}
}