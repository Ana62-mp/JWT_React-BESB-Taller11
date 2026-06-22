package com.krakedev.taller_jwt.controllers;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.krakedev.taller_jwt.entidades.Amigurumi;
import com.krakedev.taller_jwt.repositories.AmigurumiRepository;

@RestController
@RequestMapping("/api/auth/amigurumis")
@CrossOrigin(origins = "http://localhost:5173")
public class AmigurumiController {

	private final AmigurumiRepository amigurumiRepository;

	public AmigurumiController(AmigurumiRepository amigurumiRepository) {
		super();
		this.amigurumiRepository = amigurumiRepository;
	}

	@PostMapping("/registrar")
	public ResponseEntity<?> registrarAmigurumi(
			@RequestParam("file") MultipartFile file,
			@RequestParam("nombre") String nombre,
			@RequestParam("tipo") String tipo,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("tiempoElaboracion") String tiempoElaboracion,
			@RequestParam("nivelDificultad") String nivelDificultad) {

		try {
			Amigurumi amigurumi = new Amigurumi();

			amigurumi.setNombre(nombre);
			amigurumi.setTipo(tipo);
			amigurumi.setDescripcion(descripcion);
			amigurumi.setTiempoElaboracion(tiempoElaboracion);
			amigurumi.setNivelDificultad(nivelDificultad);
			amigurumi.setMimeType(file.getContentType());
			amigurumi.setFoto(file.getBytes());

			amigurumiRepository.save(amigurumi);

			return ResponseEntity.status(HttpStatus.CREATED).body("Amigurumi registrado exitosamente");

		} catch (Exception error) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al procesar los datos: " + error);
		}
	}

	@GetMapping
	public ResponseEntity<?> listarAmigurumis() {
		List<Amigurumi> lista = amigurumiRepository.findAll();

		for (Amigurumi a : lista) {
			a.setFoto(null);
		}

		return ResponseEntity.ok(lista);
	}

	@GetMapping("/{id}/foto")
	public ResponseEntity<?> obtenerFoto(@PathVariable Integer id) {
		try {
			Amigurumi amigurumi = amigurumiRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Amigurumi no encontrado"));

			String mimeType = amigurumi.getMimeType();

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.parseMediaType(mimeType));

			return new ResponseEntity<>(amigurumi.getFoto(), headers, HttpStatus.OK);

		} catch (Exception error) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("No se encontró la foto del amigurumi");
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminarAmigurumi(@PathVariable Integer id) {
		try {
			if (!amigurumiRepository.existsById(id)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.body("No existe un amigurumi con ese ID");
			}

			amigurumiRepository.deleteById(id);

			return ResponseEntity.ok("Amigurumi eliminado correctamente");

		} catch (Exception error) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al eliminar el amigurumi: " + error);
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> editarAmigurumi(
			@PathVariable Integer id,
			@RequestParam("nombre") String nombre,
			@RequestParam("tipo") String tipo,
			@RequestParam("descripcion") String descripcion,
			@RequestParam("tiempoElaboracion") String tiempoElaboracion,
			@RequestParam("nivelDificultad") String nivelDificultad,
			@RequestParam(value = "file", required = false) MultipartFile file) {

		try {
			Amigurumi amigurumi = amigurumiRepository.findById(id)
					.orElseThrow(() -> new RuntimeException("Amigurumi no encontrado"));

			amigurumi.setNombre(nombre);
			amigurumi.setTipo(tipo);
			amigurumi.setDescripcion(descripcion);
			amigurumi.setTiempoElaboracion(tiempoElaboracion);
			amigurumi.setNivelDificultad(nivelDificultad);

			if (file != null && !file.isEmpty()) {
				amigurumi.setMimeType(file.getContentType());
				amigurumi.setFoto(file.getBytes());
			}

			amigurumiRepository.save(amigurumi);

			return ResponseEntity.ok("Amigurumi actualizado correctamente");

		} catch (Exception error) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al editar el amigurumi: " + error);
		}
	}
}