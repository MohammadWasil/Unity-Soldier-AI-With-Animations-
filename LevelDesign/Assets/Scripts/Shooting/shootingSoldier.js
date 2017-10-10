#pragma strict
import UnityEngine.UI ;

var allowedRange : float = 30 ;
var damagePoint : int = 10 ;
var calculatedDistance : float ;
public var fpsCam : Camera ;
public var damageSoldier : boolean ;

public var shotsFired : int = 0 ;
private var soldier : Soldier ;

function Start () {
	damageSoldier = false ;
}

function Update () 
{
		
	if(Input.GetButtonDown("Fire1"))
	{
		Debug.Log("fire fire fire!!!") ;
		var fwd = fpsCam.transform.TransformDirection(Vector3.forward) ;
		var shotDistance : RaycastHit ;
		if(Physics.Raycast(fpsCam.transform.position, fwd, shotDistance) )
		{
			calculatedDistance = shotDistance.distance ;
			if( calculatedDistance < allowedRange	)
			{
				var soldier : Soldier = shotDistance.transform.GetComponent.<Soldier>() ; 
				if(shotDistance.collider.gameObject.tag == "Soldier")
				{
					damageSoldier = true ;
					Debug.Log("sodlier hit") ;
					if(soldier != null)
					{
						soldier.DamageHealth(damagePoint) ;
					}
				}
			}
		}
		if(soldier.shotsFiredBoolean == true)
			{
				shotsFired += 1 ;
				Debug.Log(shotsFired);
			}
	}
	else
	{
		damageSoldier = false ;
	}
}
