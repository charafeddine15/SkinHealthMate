package com.ensaj.web.rest;

import com.ensaj.domain.ImageStade;
import com.ensaj.repository.ImageStadeRepository;
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
 * REST controller for managing {@link com.ensaj.domain.ImageStade}.
 */
@RestController
@RequestMapping("/api/image-stades")
public class ImageStadeResource {

    private final Logger log = LoggerFactory.getLogger(ImageStadeResource.class);

    private static final String ENTITY_NAME = "imageStade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImageStadeRepository imageStadeRepository;

    public ImageStadeResource(ImageStadeRepository imageStadeRepository) {
        this.imageStadeRepository = imageStadeRepository;
    }

    /**
     * {@code POST  /image-stades} : Create a new imageStade.
     *
     * @param imageStade the imageStade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new imageStade, or with status {@code 400 (Bad Request)} if the imageStade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ImageStade> createImageStade(@RequestBody ImageStade imageStade) throws URISyntaxException {
        log.debug("REST request to save ImageStade : {}", imageStade);
        if (imageStade.getId() != null) {
            throw new BadRequestAlertException("A new imageStade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ImageStade result = imageStadeRepository.save(imageStade);
        return ResponseEntity
            .created(new URI("/api/image-stades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /image-stades/:id} : Updates an existing imageStade.
     *
     * @param id the id of the imageStade to save.
     * @param imageStade the imageStade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imageStade,
     * or with status {@code 400 (Bad Request)} if the imageStade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the imageStade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ImageStade> updateImageStade(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ImageStade imageStade
    ) throws URISyntaxException {
        log.debug("REST request to update ImageStade : {}, {}", id, imageStade);
        if (imageStade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imageStade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imageStadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ImageStade result = imageStadeRepository.save(imageStade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imageStade.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /image-stades/:id} : Partial updates given fields of an existing imageStade, field will ignore if it is null
     *
     * @param id the id of the imageStade to save.
     * @param imageStade the imageStade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imageStade,
     * or with status {@code 400 (Bad Request)} if the imageStade is not valid,
     * or with status {@code 404 (Not Found)} if the imageStade is not found,
     * or with status {@code 500 (Internal Server Error)} if the imageStade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ImageStade> partialUpdateImageStade(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody ImageStade imageStade
    ) throws URISyntaxException {
        log.debug("REST request to partial update ImageStade partially : {}, {}", id, imageStade);
        if (imageStade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imageStade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imageStadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ImageStade> result = imageStadeRepository
            .findById(imageStade.getId())
            .map(existingImageStade -> {
                if (imageStade.getPicture() != null) {
                    existingImageStade.setPicture(imageStade.getPicture());
                }
                if (imageStade.getPictureContentType() != null) {
                    existingImageStade.setPictureContentType(imageStade.getPictureContentType());
                }

                return existingImageStade;
            })
            .map(imageStadeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, imageStade.getId())
        );
    }

    /**
     * {@code GET  /image-stades} : get all the imageStades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of imageStades in body.
     */
    @GetMapping("")
    public List<ImageStade> getAllImageStades() {
        log.debug("REST request to get all ImageStades");
        return imageStadeRepository.findAll();
    }

    /**
     * {@code GET  /image-stades/:id} : get the "id" imageStade.
     *
     * @param id the id of the imageStade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the imageStade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ImageStade> getImageStade(@PathVariable String id) {
        log.debug("REST request to get ImageStade : {}", id);
        Optional<ImageStade> imageStade = imageStadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(imageStade);
    }

    /**
     * {@code DELETE  /image-stades/:id} : delete the "id" imageStade.
     *
     * @param id the id of the imageStade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImageStade(@PathVariable String id) {
        log.debug("REST request to delete ImageStade : {}", id);
        imageStadeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
