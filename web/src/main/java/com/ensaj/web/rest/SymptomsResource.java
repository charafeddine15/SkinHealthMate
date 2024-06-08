package com.ensaj.web.rest;

import com.ensaj.domain.Symptoms;
import com.ensaj.repository.SymptomsRepository;
import com.ensaj.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ensaj.domain.Symptoms}.
 */
@RestController
@RequestMapping("/api/symptoms")
public class SymptomsResource {

    private final Logger log = LoggerFactory.getLogger(SymptomsResource.class);

    private static final String ENTITY_NAME = "symptoms";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SymptomsRepository symptomsRepository;

    public SymptomsResource(SymptomsRepository symptomsRepository) {
        this.symptomsRepository = symptomsRepository;
    }

    /**
     * {@code POST  /symptoms} : Create a new symptoms.
     *
     * @param symptoms the symptoms to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new symptoms, or with status {@code 400 (Bad Request)} if the symptoms has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Symptoms> createSymptoms(@RequestBody Symptoms symptoms) throws URISyntaxException {
        log.debug("REST request to save Symptoms : {}", symptoms);
        if (symptoms.getId() != null) {
            throw new BadRequestAlertException("A new symptoms cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Symptoms result = symptomsRepository.save(symptoms);
        return ResponseEntity
            .created(new URI("/api/symptoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /symptoms/:id} : Updates an existing symptoms.
     *
     * @param id the id of the symptoms to save.
     * @param symptoms the symptoms to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated symptoms,
     * or with status {@code 400 (Bad Request)} if the symptoms is not valid,
     * or with status {@code 500 (Internal Server Error)} if the symptoms couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Symptoms> updateSymptoms(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Symptoms symptoms
    ) throws URISyntaxException {
        log.debug("REST request to update Symptoms : {}, {}", id, symptoms);
        if (symptoms.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, symptoms.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!symptomsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Symptoms result = symptomsRepository.save(symptoms);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, symptoms.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /symptoms/:id} : Partial updates given fields of an existing symptoms, field will ignore if it is null
     *
     * @param id the id of the symptoms to save.
     * @param symptoms the symptoms to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated symptoms,
     * or with status {@code 400 (Bad Request)} if the symptoms is not valid,
     * or with status {@code 404 (Not Found)} if the symptoms is not found,
     * or with status {@code 500 (Internal Server Error)} if the symptoms couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Symptoms> partialUpdateSymptoms(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Symptoms symptoms
    ) throws URISyntaxException {
        log.debug("REST request to partial update Symptoms partially : {}, {}", id, symptoms);
        if (symptoms.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, symptoms.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!symptomsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Symptoms> result = symptomsRepository
            .findById(symptoms.getId())
            .map(existingSymptoms -> {
                if (symptoms.getNom() != null) {
                    existingSymptoms.setNom(symptoms.getNom());
                }

                return existingSymptoms;
            })
            .map(symptomsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, symptoms.getId())
        );
    }

    /**
     * {@code GET  /symptoms} : get all the symptoms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of symptoms in body.
     */
    @GetMapping("")
    public List<Symptoms> getAllSymptoms() {
        log.debug("REST request to get all Symptoms");
        return symptomsRepository.findAll();
    }

    /**
     * {@code GET  /symptoms/:id} : get the "id" symptoms.
     *
     * @param id the id of the symptoms to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the symptoms, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Symptoms> getSymptoms(@PathVariable String id) {
        log.debug("REST request to get Symptoms : {}", id);
        Optional<Symptoms> symptoms = symptomsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(symptoms);
    }

    /**
     * {@code DELETE  /symptoms/:id} : delete the "id" symptoms.
     *
     * @param id the id of the symptoms to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSymptoms(@PathVariable String id) {
        log.debug("REST request to delete Symptoms : {}", id);
        symptomsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
