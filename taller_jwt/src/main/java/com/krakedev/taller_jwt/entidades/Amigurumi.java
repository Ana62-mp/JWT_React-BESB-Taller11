package com.krakedev.taller_jwt.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "amigurumis")
public class Amigurumi {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private String tipo;

	@Column(nullable = false, length = 500)
	private String descripcion;

	@Column(name = "tiempo_elaboracion", nullable = false)
	private String tiempoElaboracion;

	@Column(name = "nivel_dificultad", nullable = false)
	private String nivelDificultad;

	@Column(name = "mime_type")
	private String mimeType;

	@Column(name = "foto", columnDefinition = "bytea")
	private byte[] foto;

	public Amigurumi() {
		super();
	}

	public Amigurumi(String nombre, String tipo, String descripcion, String tiempoElaboracion,
			String nivelDificultad, String mimeType, byte[] foto) {
		super();
		this.nombre = nombre;
		this.tipo = tipo;
		this.descripcion = descripcion;
		this.tiempoElaboracion = tiempoElaboracion;
		this.nivelDificultad = nivelDificultad;
		this.mimeType = mimeType;
		this.foto = foto;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getTiempoElaboracion() {
		return tiempoElaboracion;
	}

	public void setTiempoElaboracion(String tiempoElaboracion) {
		this.tiempoElaboracion = tiempoElaboracion;
	}

	public String getNivelDificultad() {
		return nivelDificultad;
	}

	public void setNivelDificultad(String nivelDificultad) {
		this.nivelDificultad = nivelDificultad;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public byte[] getFoto() {
		return foto;
	}

	public void setFoto(byte[] foto) {
		this.foto = foto;
	}
}