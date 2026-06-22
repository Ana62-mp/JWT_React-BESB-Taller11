package com.krakedev.taller_jwt.services;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class TokenBlackListService {
	private final Set<String> blackList = ConcurrentHashMap.newKeySet();
	
	public void invalidarToken(String token) {
		blackList.add(token);
	}
	
	public boolean estaInvalidado(String token) {
		return blackList.contains(token);
	}
}
