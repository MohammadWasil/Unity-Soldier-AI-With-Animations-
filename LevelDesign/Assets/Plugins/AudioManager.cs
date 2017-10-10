using UnityEngine.Audio;
using System;
using UnityEngine;

public class AudioManager : MonoBehaviour 
{
	public sound[] sounds;
	void Awake () 
	{
		foreach (sound s in sounds) 
		{
			s.source = gameObject.AddComponent<AudioSource> ();
			s.source.clip = s.clip;

			s.source.volume = s.volume;
			s.source.pitch = s.pitch;
		}
	}
	
	public void PlayMusic(string name)
	{
		sound s = Array.Find (sounds, sound => sound.name == name);
		s.source.Play ();
		Debug.Log ("audio playing");
	}

}
