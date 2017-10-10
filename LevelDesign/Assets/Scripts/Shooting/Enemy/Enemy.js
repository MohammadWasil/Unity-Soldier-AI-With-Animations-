// Our enemy will only have one type of gun!
// And there gun will be very powerfull then ours!

#pragma strict

public var health : int = 25 ;
public var Hero : GameObject ;
public var eyes : GameObject ;
public var eyes_02 : GameObject ;
public var ten_m_away : Transform ;
public var target : Transform  ;
public var wait : float = 5f ;

private var nav : NavMeshAgent ;
private var state : String = "idle" ;
private var shoot : Shoot ;
private var highAlert : boolean = false ;
private var alert : float = 20f ;


//instances for the scripts
@HideInInspector
public var heroHealth : Hero ;

function Start () 
{
	nav = GetComponent.<NavMeshAgent>() ;
	heroHealth = GameObject.Find("Hero").GetComponent.<Hero>() ;
	nav.speed = 5f ;
	shoot = GameObject.FindWithTag("Enemy").GetComponentInChildren.<Shoot>() ; 
	eyes_02.SetActive(false) ;

	//Hide
	var colliders : Collider[] ;


}

function visionSight()
{
	if(health > 0)
	{
		nav.speed = 7.5f ;	
		var visionRayHit : RaycastHit ;
		if(Physics.Linecast(eyes.transform.position, Hero.transform.position, visionRayHit))
		{
			if(visionRayHit.collider.gameObject.tag == "Player" )
			{
				if(state != "Kill")
				{	
					state = "hide" ;
					Debug.Log("It is in the visionSight() function. "); 
				}
			}
		}
	}

}

function Update () 
{
	if(health >= 0)
	{
		//nav.SetDestination(Hero.transform.position) ;
	
		//idle
		if(state == "idle")
		{
			nav.speed = 5f ;
			// patrolling
			var randomPos : Vector3 = Random.insideUnitSphere * alert ; 			// radius of alert unit.

			var navHit : NavMeshHit ;
			NavMesh.SamplePosition(transform.position + randomPos, navHit, 10f, NavMesh.AllAreas ) ;

			/*if(highAlert)
			{
				NavMesh.SamplePosition(transform.position + randomPos, navHit, 10f, NavMesh.AllAreas ) ;
				alert += 5f ;

				if(alert > 20f)
				{
					highAlert = false ;
					eyes.SetActive(true) ;
					eyes_02.SetActive(false) ;
				}

			}
			*/
			nav.SetDestination(navHit.position) ;
			state = "walk" ;
		}

		//walk
		if(state == "walk")
		{
			if(nav.remainingDistance <= nav.stoppingDistance && !nav.pathPending)
			{
				state = "search" ;
				wait = 5f ;
			}
		}

		//search
		if(state == "search")
		{
			if(wait <= 0)
			{
				state = "idle" ;
				//wait = 5f ;
			}
			else
			{
				wait -= Time.deltaTime ;
				gameObject.transform.Rotate(0f, 90f * Time.deltaTime, 0f ) ;
			}
		}

		//hide
		if(state == "hide" )
		{
			var colliders : Collider[] = Physics.OverlapSphere(transform.position, 6f) ;
			var colliderLength : int = colliders.Length ;
			var range : int = Random.Range(0, colliderLength) ;
			var hidePos : Transform ;
			//colliders.Length = range ;

			Debug.Log( "collider_no " + range ) ;
			var i : int ;
			for( i = 0 ; i <= colliderLength ; i++ )
			{
				if( i == (range) )
				{
					var distance_01 : float = Vector3.Distance(transform.position, Hero.transform.position) ;
					if(distance_01 <= 20f)
					{
						Debug.Log( "destination is " + colliders[i].gameObject.transform.position );
						state = "shoot" ;
						transform.LookAt(target) ;
						nav.SetDestination(colliders[i].gameObject.transform.position ) ;
					}
					else
					{
						state = "hunt" ;
					}
				}
			}
		}

		//shoot
		if(state == "shoot")
		{
			
			shoot.Shoot() ;
			eyes.SetActive(false) ;
			eyes_02.SetActive(true) ;
			nav.destination = Hero.transform.position - ten_m_away.transform.position ;
			transform.LookAt(target) ;

			var distance : float = Vector3.Distance(transform.position, Hero.transform.position) ;

			if(distance > 20f )
			{
				nav.speed = 6f ;
				state = "hunt" ;
				eyes.SetActive(true) ;
				eyes_02.SetActive(false) ;
			}
			else
			{
				if(heroHealth.heroHealth <= 0)
				{
					state = "kill" ;
				}
			}

		}

		//hunt
		if(state == "hunt" )
		{
			if(nav.remainingDistance <= nav.stoppingDistance && !nav.pathPending)
			{
				state = "search" ;
				wait = 5f ;
				highAlert = true ;
				alert = 5f ;
				eyes.SetActive(true) ;
				eyes_02.SetActive(false) ;
			}
		}

		//kill
		if(state == "kill")
		{
			nav.speed = 5f ;
			state = "idle" ;
			Hero.gameObject.SetActive(false) ;
			eyes.SetActive(true) ;
			eyes_02.SetActive(false) ;
			//Hero.GetComponent.<MainCamera>().enabled = false ;
			//move to another scene or something.				
		}
	}
	
	else
	{
		Destroy(gameObject) ;
	}

	//nav.SetDestination(Hero.transform.position) ;
}

function DamageHealth( damagePoint : int)
{
	health -= damagePoint ;

	if(health <= 0)
	{
		Destroy(gameObject) ;
	}
}