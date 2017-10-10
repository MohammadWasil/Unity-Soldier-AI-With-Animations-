#pragma strict

import UnityEngine.AI ;
import System.Collections;
import System.Collections.Generic;
import UnityEngine.Audio ;

public var health : int = 100 ;
public var wait = 0f ;
public var hero : GameObject ;
public var eyes_L : GameObject ;
public var eyes_R : GameObject ;
public var target_Hero : Transform  ;
public var reload : int = 30 ;
public var muzzleFlash : ParticleSystem ;
private var audio_Death : AudioSource ;
public var audioDeath_Clip : AudioClip ;
public var shotsFiredBoolean : boolean = false ;


private var nav : NavMeshAgent ;
private var state : String = "idle" ;
private var animator : Animator ;
private var shootStraightLine : boolean = false ;
private var highAlert : boolean = false ;
public var alertness : float ;
public var shootingSolider : shootingSoldier ;
private var waitingTime : boolean = false ;
private var audioManager : AudioManager ;
public var heroHealth : Hero ;


function Awake()
{
	hero = GameObject.Find("FPSController") ;														//Reference to the player.
	target_Hero = GameObject.Find("FPSController").GetComponent.<Transform>() ;						
	shootingSolider = GameObject.Find("FPSController").GetComponentInChildren.<shootingSoldier>() ;
	audioManager = GameObject.Find("AudioManager").GetComponent.<AudioManager>() ;
	heroHealth = GameObject.Find("FPController").GetComponent.<Hero>() ;
}

function Start () 
{
	nav = GetComponent.<NavMeshAgent>() ;	
	animator = GetComponent.<Animator>() ;
}

function Sight()
{
	if(health > 0)
	{
		var rayHit : RaycastHit ;
		if((Physics.Linecast(eyes_L.transform.position, hero.transform.position, rayHit)) || (Physics.Linecast(eyes_R.transform.position, hero.transform.position, rayHit)) )
		{
			if(rayHit.collider.gameObject.tag == "Player")
			{
				if(state != "kill")
				{
					state = "shoot" ;
				}
			}
		}
	}

}

function Update () 
{	
	if(health > 0)	
	{
		animator.SetBool("search", false) ;
		//idle
		if(state == "idle")
		{
			muzzleFlash.Stop() ;
			animator.SetBool("walk", true) ;
			animator.SetBool("runtorun", false) ;
			animator.SetBool("fire", false) ;
			var randomPos : Vector3 = Random.insideUnitSphere * 25 ;

			var navHit : NavMeshHit ;
			NavMesh.SamplePosition(transform.position + randomPos, navHit, 10f, NavMesh.AllAreas) ;

			if(highAlert)
			{
				NavMesh.SamplePosition(hero.transform.position + randomPos, navHit, 10f, NavMesh.AllAreas ) ;

				alertness += 5f ;
				animator.SetBool("walk", false) ;
				animator.SetBool("runsearch", false) ;
				animator.SetBool("searchrun", true) ;

				var distance_03 : float = Vector3.Distance(transform.position, hero.transform.position) ;
				if(distance_03 <= 15f)
				{
					nav.destination = hero.transform.position ;
					state = "shoot" ;
				}

				if(alertness > 20f)
				{
					highAlert = false ;
					state == "idle" ;

				}
			}

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
			//For soldier to inflict damage.
			if(shootingSolider.damageSoldier == true)
			{
				animator.SetBool("hitStand", true) ;
				audioManager.PlayMusic("Enemy_Hit");
				state = "shoot" ;
			}
			else
			{
				animator.SetBool("hitStand", false) ;
			}

		}

		//search
		if(state == "search")
		{
			if(wait <= 0)
			{
				state = "idle"	 ;
			}
			else
			{
				wait -= Time.deltaTime ;
				animator.SetBool("runsearch", true) ;
				animator.SetBool("searchrun", false) ;
				animator.SetBool("run", false) ;
				animator.SetBool("walk", false) ;
				animator.SetBool("search", true) ;
				muzzleFlash.Stop() ;
			}
			//For soldier to inflict damage.
			if(shootingSolider.damageSoldier == true)
			{
				animator.SetBool("hitStand", true) ;
				audioManager.PlayMusic("Enemy_Hit");
				muzzleFlash.Stop() ;
				state = "shoot" ;
			}
			else
			{
				animator.SetBool("hitStand", false) ;
			}
			
		}
		/*
		if(state == "chase")
		{
			animator.SetBool("search", false) ;
			Debug.Log("chase") ;
			nav.destination = hero.transform.position ;
			animator.SetBool("run", true) ;
			var distance : float = Vector3.Distance(transform.position, hero.transform.position); 

			if(distance > 25f)
			{
				state = "hunt" ;
			}
			else if(nav.remainingDistance <= nav.stoppingDistance + 1f && !nav.pathPending ) 		//too close to the player.
			{
				state = "shoot" ;
			}
		}
		*/
		if(state == "shoot")
		{
			shotsFiredBoolean = true ;
			var rayHit_Shoot : RaycastHit ;

				nav.Stop() ;
					reload -= 1 ;

					muzzleFlash.Play() ;
					audioManager.PlayMusic("Enemy_Fire");
						if(reload < 0)
						{
							reload = 0 ;
							animator.SetBool("reload", true) ;
							audioManager.PlayMusic("Enemy_Reload");


							muzzleFlash.Stop() ;
							waitingTime = true ;
							waitTime() ;
						}
						else if(reload > 0)
						{
							animator.SetBool("reload", false) ;
							audioManager.PlayMusic("Enemy_Fire");
							muzzleFlash.Play() ;

						}

					animator.SetBool("fire", true) ;
					transform.LookAt(target_Hero) ;
			if((Physics.Linecast(eyes_L.transform.position, hero.transform.position, rayHit_Shoot)) || (Physics.Linecast(eyes_R.transform.position, hero.transform.position, rayHit_Shoot)) )
			{	
				if(rayHit_Shoot.collider.gameObject.tag == "Player")
				{
					//Hero health will decrease.
					var healthDestroy : int = Random.Range(1, 10) ;
					Debug.Log(healthDestroy) ;
					if(healthDestroy == 3 )
					{
						heroHealth.heroHealth -= 1 ;
					}
					else if(healthDestroy == 6 )
					{
						heroHealth.heroHealth -= 2 ;
					}	
					else if(healthDestroy == 9 )
					{
						heroHealth.heroHealth -= 3 ;
					}
					heroHealth.shoot = true ;

				}
				else
				{
					//Nothing!!!
				}

			}
			animator.SetBool("fire", false) ;
			var distance_01 : float = Vector3.Distance(transform.position, hero.transform.position); 
			Debug.Log("distance = " + distance_01) ;
			if(distance_01 > 8f) 
			{
				//nav.ResetPath() ;
				nav.Resume() ;
				nav.destination = hero.transform.position ;
				muzzleFlash.Stop() ;
				audioManager.PlayMusic("Enemy_Null");
				animator.SetBool("run", true) ;	
			}
		
			else if( (distance_01 <= 8f) && (distance_01 > 4f))
			{
				nav.Stop() ;
				reload -= 1 ;

				muzzleFlash.Play() ;

				audioManager.PlayMusic("Enemy_Fire");
			
					if(reload < 0)
					{
						reload = 0 ;
						animator.SetBool("reload", true) ;
						audioManager.PlayMusic("Enemy_Reload");

						waitingTime = true ;
						muzzleFlash.Stop() ;
						waitTime() ;
					}
					else if(reload > 0)
					{
						animator.SetBool("reload", false) ;
						audioManager.PlayMusic("Enemy_Fire");
						muzzleFlash.Play() ;
					}
	
				animator.SetBool("run", false) ;
				animator.SetBool("fire", true) ;
				transform.LookAt(target_Hero) ;
			}

			//tries to hide
			if(shootingSolider.shotsFired >= 6)
			{
				state = "hideSpot" ;
				audioManager.PlayMusic("Enemy_Null");
				Debug.Log("move to hideSpot state") ;
			}

			if(distance_01 > 25f)
			{
				state = "hunt" ;
			}
			//For soldier to inflict damage.
			if(shootingSolider.damageSoldier == true)
			{
				animator.SetBool("hit", true) ;
				audioManager.PlayMusic("Enemy_Hit");
			}
			else
			{
				animator.SetBool("hit", false) ;
			}
		}
		shootStraightLine = false ;

		if(state == "hideSpot") 
		{
			Debug.Log("state is hideSpot" );

			var colliders : Collider[] = Physics.OverlapSphere(transform.position, 10f) ;
			var colliderLength : int = colliders.Length ;
			var range : int = Random.Range(0, colliderLength) ;
			audioManager.PlayMusic("Enemy_Null");
			muzzleFlash.Stop() ;
			var i : int ;
			for( i = 0 ; i <= colliderLength ; i++)
			{
				Debug.Log("colliders of "+ colliders[i]) ;
				if((colliders[i].gameObject.tag == "Wall")) //|| (colliders[i].gameObject.tag == "box1") || (colliders[i].gameObject.tag == "box2") || (colliders[i].gameObject.tag == "crate") || (colliders[i].gameObject.tag == "container") || (colliders[i].gameObject.tag == "barrel") )
				{
					if(i == (range))
					{
						nav.Resume() ;
						Debug.Log(colliders[i].gameObject.tag) ;
						Debug.Log(" it is near the gameObject"+colliders[i]) ;
						nav.destination = colliders[i].gameObject.transform.position ;
						animator.SetBool("run", true) ;
						animator.SetBool("fire", false) ;
						state = "hide" ;

					}
				}

			}
		}

		if(state == "hide")
		{
			Debug.Log("state hide") ;
			if(nav.remainingDistance <= nav.stoppingDistance && !nav.pathPending)
			{
				animator.SetBool("hideUpRun", false) ;
				animator.SetBool("hide", false) ;
				animator.SetBool("hideFire", false) ;
				animator.SetBool("hideUp", false) ;
				muzzleFlash.Play() ;
				audioManager.PlayMusic("Enemy_Fire");
				animator.SetBool("hide", true) ;
				animator.SetBool("fire", false) ;
				animator.SetBool("run", false) ;
				transform.LookAt(target_Hero) ;
				var rayHit_HideShoot : RaycastHit ;
				animator.SetBool("fire", false) ;

					nav.Stop() ;
					reload -= 1 ;
					if(reload < 0)
						{
							reload = 0 ;
							animator.SetBool("reload", true) ;
							audioManager.PlayMusic("Enemy_Reload");
							muzzleFlash.Stop() ;
							waitingTime = true ;
							waitTime() ;
						}
						else if(reload > 0)
						{
							animator.SetBool("reload", false) ;
							audioManager.PlayMusic("Enemy_Fire");
							muzzleFlash.Play() ;
						}
					animator.SetBool("hideFire", true) ;
				if((Physics.Linecast(eyes_L.transform.position, hero.transform.position, rayHit_HideShoot)) || (Physics.Linecast(eyes_R.transform.position, hero.transform.position, rayHit_HideShoot)) )
				{
					if(rayHit_HideShoot.collider.gameObject.tag == "Player")
					{
						//Hero health will decrease.
						var healthDestroy_01 : int = Random.Range(1, 20) ;
						Debug.Log(healthDestroy) ;
						if(healthDestroy_01 == 11 )
						{
							heroHealth.heroHealth -= 1 ;
						}
						else if(healthDestroy_01 == 6 )
						{
							heroHealth.heroHealth -= 2 ;
						}	
						else if(healthDestroy_01 == 9 )
						{
							heroHealth.heroHealth -= 3 ;
						}
						heroHealth.shoot = true ;
					}
					else
					{
						//nothing!!!
					}

				}

				var distance_04 : float = Vector3.Distance(transform.position, hero.transform.position);
				Debug.Log("distance_04 = "+distance_04);

				if(distance_04 > 20f) 		//for the time being, 10f will be changed to 40f.
				{
					animator.SetBool("hideUp", true) ;	
					//animator.SetBool("hideUpRun", true) ;
					Debug.Log("hide to run");

					state = "hideUp" ;
				}
				shootingSolider.shotsFired = 0 ;
			}

			if(shootingSolider.damageSoldier == true)
			{
				animator.SetBool("hit", true) ;
				audioManager.PlayMusic("Enemy_Hit");
			}
			else
			{
				animator.SetBool("hit", false) ;
			}
		}

		if(state == "hideUp")
		{
			animator.SetBool("hideUpRun", true) ;
			animator.SetBool("hide", false) ;
			animator.SetBool("hideFire", false) ;
			state = "shoot" ;
		}

		if(state == "hunt")
		{
			muzzleFlash.Stop() ;
			audioManager.PlayMusic("Enemy_Null");
			Debug.Log("state hunt") ;
			var distance_02 : float = Vector3.Distance(transform.position, hero.transform.position) ;

			if((Physics.Linecast(eyes_L.transform.position, hero.transform.position, rayHit_Shoot)) || (Physics.Linecast(eyes_R.transform.position, hero.transform.position, rayHit_Shoot)) || distance_02 <= 6f )
			{
				if(rayHit_Shoot.collider.gameObject.tag == "Player")
				{
				nav.destination = hero.transform.position ;
				state = "shoot" ;
				}
			}

			if(nav.remainingDistance <= nav.stoppingDistance && !nav.pathPending )
			{
				state = "search"; 
				wait = 5f ;
				highAlert = true ;
				alertness = 5f ;
				animator.SetBool("runtorun", true) ;
				animator.SetBool("runsearch", true) ;
				animator.SetBool("searchrun", false) ;
			}
		}

		if(reload > 0)
		{
			animator.SetBool("reload", false) ;
		}

	}
	else
	{
		Debug.Log("Deatj");
		health = 0 ;
		audio_Death.PlayOneShot(audioDeath_Clip) ;
		muzzleFlash.Stop() ;
		animator.SetBool("hideDeath", true) ;
		animator.SetBool("death", true) ;
		nav.Stop() ;
	}
}

function DamageHealth( damagePoint : int)
{
	health -= damagePoint ;

	if(health < 0)
	{
		health = 0 ;
		audio_Death.PlayOneShot(audioDeath_Clip) ;
		muzzleFlash.Stop() ;

			animator.SetBool("hideDeath", true) ;
		
			animator.SetBool("death", true) ;
		
		nav.Stop() ;
	}
}

function waitTime()
{
	if(waitingTime == true)
	{
		muzzleFlash.Stop() ;
		yield WaitForSeconds(1) ;
		reload = reload + 3 ;
	}
	waitingTime = false ;
}