package com.krakedev.taller_jwt.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehiculos")
public class Vehiculo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String marca;

	@Column(nullable = false)
	private String modelo;
	
	//guardar imagen (archivo)
	@Column(name = "mime_type")
	private String mimeType;
	
	//guardar bytes
	@Column(name = "foto", columnDefinition = "bytea")
	private byte[] foto;

	public Vehiculo() {
	    super();
	}

	public Vehiculo(String marca, String modelo, String mimeType, byte[] foto) {
		super();
		this.marca = marca;
		this.modelo = modelo;
		this.mimeType = mimeType;
		this.foto = foto;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public String getModelo() {
		return modelo;
	}

	public void setModelo(String modelo) {
		this.modelo = modelo;
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
