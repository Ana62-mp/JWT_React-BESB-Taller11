package com.krakedev.taller_jwt.services;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import com.krakedev.taller_jwt.entidades.Usuario;
import com.krakedev.taller_jwt.repositories.UsuarioRepository;

@Service
public class UsuarioService {

	private UsuarioRepository usuarioRepository;

	public UsuarioService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	public Usuario guardar(Usuario usuario) {
		String passwordEncriptada = BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt());
		usuario.setPassword(passwordEncriptada);

		return usuarioRepository.save(usuario);
	}

	public boolean autenticar(String username, String password) {
		Optional<Usuario> usuarioEncontrado = usuarioRepository.findByUsername(username);
		
		if(usuarioEncontrado.isPresent()) {
			Usuario usuario = usuarioEncontrado.get();
			
			if(BCrypt.checkpw(password, usuario.getPassword())) {
				return true;
			}
			
		}
		return false;
	}
}